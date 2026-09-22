interface Env {
  ASSETS: Fetcher;
  CODE_EXECUTION_API_URL?: string;
  BUILD_SHA?: string;
}

const MAX_CODE_BYTES = 100_000;
const MAX_OUTPUT_BYTES = 1_000_000;
const EXECUTION_TIMEOUT_MS = 15_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

const requestBuckets = new Map<string, { count: number; resetAt: number }>();

const LANGUAGE_IDS: Record<string, number> = {
  python: 109,
  javascript: 93,
  java: 91,
  cpp: 105,
  csharp: 51,
  php: 98,
};

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

function getClientKey(request: Request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  ).slice(0, 128);
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = requestBuckets.get(key);

  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfter: 60 };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

function byteLength(value: string) {
  return new TextEncoder().encode(value).byteLength;
}

async function executeCode(request: Request, env: Env) {
  const rateLimit = checkRateLimit(getClientKey(request));

  if (!rateLimit.allowed) {
    return json(
      { error: 'Too many code execution requests. Please wait and try again.' },
      429,
      { 'Retry-After': String(rateLimit.retryAfter), 'Cache-Control': 'no-store' },
    );
  }

  try {
    const body = await request.json() as { language?: unknown; code?: unknown };
    const language = typeof body?.language === 'string' ? body.language : '';
    const code = typeof body?.code === 'string' ? body.code : '';

    if (!Object.prototype.hasOwnProperty.call(LANGUAGE_IDS, language)) {
      return json({ error: 'Unsupported execution language.' }, 400);
    }

    if (!code.trim()) {
      return json({ error: 'Code cannot be empty.' }, 400);
    }

    if (byteLength(code) > MAX_CODE_BYTES) {
      return json({ error: 'Code exceeds the 100 KB limit.' }, 413);
    }

    const apiBase = (
      env.CODE_EXECUTION_API_URL ||
      'https://ce.judge0.com'
    ).replace(/\/$/, '');

    const submission = await fetch(
      apiBase + '/submissions?base64_encoded=false&wait=false',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language_id: LANGUAGE_IDS[language],
          source_code: code,
          cpu_time_limit: 5,
          wall_time_limit: 8,
          memory_limit: 256000,
          max_processes: 20,
        }),
      },
    );

    const created = await submission.json().catch(() => null) as {
      token?: unknown;
      error?: unknown;
    } | null;

    if (!submission.ok || !created?.token) {
      const detail =
        typeof created?.error === 'string'
          ? created.error
          : 'Execution service is unavailable.';
      return json({ error: detail }, 502);
    }

    const token = String(created.token);
    const deadline = Date.now() + EXECUTION_TIMEOUT_MS;

    while (Date.now() < deadline) {
      const resultResponse = await fetch(
        apiBase +
          '/submissions/' +
          encodeURIComponent(token) +
          '?base64_encoded=false&fields=stdout,stderr,compile_output,message,status,exit_code',
        { headers: { Accept: 'application/json' } },
      );

      const result = await resultResponse.json().catch(() => null) as {
        stdout?: unknown;
        stderr?: unknown;
        compile_output?: unknown;
        message?: unknown;
        exit_code?: unknown;
        status?: unknown;
      } | null;

      if (!resultResponse.ok) {
        return json({ error: 'Could not read the execution result.' }, 502);
      }

      const statusId = Number((result?.status as { id?: unknown } | undefined)?.id);

      if (statusId !== 1 && statusId !== 2) {
        const stdout = typeof result?.stdout === 'string' ? result.stdout : '';
        const stderr = typeof result?.stderr === 'string' ? result.stderr : '';
        const compileOutput =
          typeof result?.compile_output === 'string'
            ? result.compile_output
            : '';
        const message = typeof result?.message === 'string' ? result.message : '';
        const combined = stdout + stderr + compileOutput + message;

        if (byteLength(combined) > MAX_OUTPUT_BYTES) {
          return json(
            { error: 'Execution output exceeded the 1 MB limit.' },
            413,
          );
        }

        return json({
          stdout,
          stderr,
          compileOutput,
          message,
          code: result?.exit_code ?? null,
          status: result?.status ?? null,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    return json({ error: 'Execution timed out after 15 seconds.' }, 408);
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Invalid execution request.',
      },
      400,
    );
  }
}

async function youtubeThumbnail(request: Request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId') || '';

  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return new Response('Invalid YouTube video ID.', { status: 400 });
  }

  const levels = [
    'maxresdefault',
    'sddefault',
    'hqdefault',
    'mqdefault',
    'default',
  ];

  for (const level of levels) {
    const sourceUrl =
      'https://i.ytimg.com/vi/' + videoId + '/' + level + '.jpg';

    try {
      const response = await fetch(sourceUrl, {
        headers: {
          Accept:
            'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });

      if (!response.ok) continue;

      const contentType =
        response.headers.get('content-type') || 'image/jpeg';

      return new Response(await response.arrayBuffer(), {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition':
            'attachment; filename="youtube-thumbnail-' + videoId + '.jpg"',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch {
      // Try the next supported resolution.
    }
  }

  return new Response('Thumbnail not found for this video.', { status: 404 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/execute-code') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }
      return executeCode(request, env);
    }

    if (url.pathname === '/api/youtube-thumbnail') {
      if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
      }
      return youtubeThumbnail(request);
    }

    if (url.pathname === '/api/build-version') {
      return json({
        commit: env.BUILD_SHA || 'cloudflare-test',
      });
    }

    return env.ASSETS.fetch(request);
  },
};
