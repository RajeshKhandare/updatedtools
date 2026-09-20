import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_CODE_BYTES = 100_000;
const MAX_OUTPUT_BYTES = 1_000_000;
const TIMEOUT_MS = 15_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return (forwarded?.split(',')[0]?.trim() || realIp || 'unknown').slice(0, 128);
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = requestBuckets.get(key);

  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 60 };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
}


const LANGUAGE_IDS: Record<
  string,
  number
> = {
  python: 109,
  javascript: 93,
  java: 91,
  cpp: 105,
  csharp: 51,
  php: 98,
};

function bytes(value: string) {
  return new TextEncoder()
    .encode(value)
    .byteLength;
}

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

export async function POST(
  request: NextRequest
) {
  const rateLimit = checkRateLimit(getClientKey(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many code execution requests. Please wait and try again.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter), 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const body =
      await request.json();

    const language =
      typeof body?.language ===
      'string'
        ? body.language
        : '';

    const code =
      typeof body?.code === 'string'
        ? body.code
        : '';

    if (
      !Object.prototype.hasOwnProperty.call(
        LANGUAGE_IDS,
        language
      )
    ) {
      return NextResponse.json(
        {
          error:
            'Unsupported execution language.',
        },
        { status: 400 }
      );
    }

    if (!code.trim()) {
      return NextResponse.json(
        {
          error:
            'Code cannot be empty.',
        },
        { status: 400 }
      );
    }

    if (
      bytes(code) >
      MAX_CODE_BYTES
    ) {
      return NextResponse.json(
        {
          error:
            'Code exceeds the 100 KB limit.',
        },
        { status: 413 }
      );
    }

    const apiBase = (
      process.env.CODE_EXECUTION_API_URL ||
      'https://ce.judge0.com'
    ).replace(/\/$/, '');

    const submission =
      await fetch(
        apiBase +
          '/submissions?base64_encoded=false&wait=false',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            language_id:
              LANGUAGE_IDS[language],
            source_code: code,
            cpu_time_limit: 5,
            wall_time_limit: 8,
            memory_limit:
              256000,
            max_processes: 20,
          }),
          cache: 'no-store',
        }
      );

    const created =
      await submission
        .json()
        .catch(() => null);

    if (
      !submission.ok ||
      !created?.token
    ) {
      const detail =
        typeof created?.error ===
        'string'
          ? created.error
          : 'Execution service is unavailable.';
      return NextResponse.json(
        { error: detail },
        { status: 502 }
      );
    }

    const token =
      String(created.token);

    const deadline =
      Date.now() +
      TIMEOUT_MS;

    while (
      Date.now() <
      deadline
    ) {
      const resultResponse =
        await fetch(
          apiBase +
            '/submissions/' +
            encodeURIComponent(
              token
            ) +
            '?base64_encoded=false&fields=stdout,stderr,compile_output,message,status,exit_code',
          {
            method: 'GET',
            headers: {
              Accept:
                'application/json',
            },
            cache: 'no-store',
          }
        );

      const result =
        await resultResponse
          .json()
          .catch(() => null);

      if (
        !resultResponse.ok
      ) {
        return NextResponse.json(
          {
            error:
              'Could not read the execution result.',
          },
          { status: 502 }
        );
      }

      const statusId =
        Number(
          result?.status?.id
        );

      // Judge0 statuses 1 and 2 are
      // still queued/processing.
      if (
        statusId !== 1 &&
        statusId !== 2
      ) {
        const stdout =
          typeof result?.stdout ===
          'string'
            ? result.stdout
            : '';

        const stderr =
          typeof result?.stderr ===
          'string'
            ? result.stderr
            : '';

        const compileOutput =
          typeof result?.compile_output ===
          'string'
            ? result.compile_output
            : '';

        const message =
          typeof result?.message ===
          'string'
            ? result.message
            : '';

        const combined =
          stdout +
          stderr +
          compileOutput +
          message;

        if (
          bytes(combined) >
          MAX_OUTPUT_BYTES
        ) {
          return NextResponse.json(
            {
              error:
                'Execution output exceeded the 1 MB limit.',
            },
            { status: 413 }
          );
        }

        return NextResponse.json({
          stdout,
          stderr,
          compileOutput,
          message,
          code:
            result?.exit_code ??
            null,
          status:
            result?.status ??
            null,
        });
      }

      await sleep(400);
    }

    return NextResponse.json(
      {
        error:
          'Execution timed out after 15 seconds.',
      },
      { status: 408 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Invalid execution request.',
      },
      { status: 400 }
    );
  }
}
