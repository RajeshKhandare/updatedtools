import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_CODE_BYTES = 100_000;
const MAX_OUTPUT_BYTES = 1_000_000;
const TIMEOUT_MS = 8_000;
const ALLOWED = new Set(['python', 'javascript', 'java', 'cpp', 'csharp', 'php']);

function bytes(value: string) {
  return new TextEncoder().encode(value).byteLength;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const language = typeof body?.language === 'string' ? body.language : '';
    const code = typeof body?.code === 'string' ? body.code : '';

    if (!ALLOWED.has(language)) {
      return NextResponse.json({ error: 'Unsupported execution language.' }, { status: 400 });
    }
    if (!code.trim()) {
      return NextResponse.json({ error: 'Code cannot be empty.' }, { status: 400 });
    }
    if (bytes(code) > MAX_CODE_BYTES) {
      return NextResponse.json({ error: 'Code exceeds the 100 KB limit.' }, { status: 413 });
    }

    const pistonUrl = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute';
    const runtimes: Record<string, { language: string; version: string }> = {
      python: { language: 'python', version: '3.10' },
      javascript: { language: 'javascript', version: '18.15.0' },
      java: { language: 'java', version: '15.0.2' },
      cpp: { language: 'c++', version: '10.2.0' },
      csharp: { language: 'csharp', version: '6.12.0' },
      php: { language: 'php', version: '8.2.3' },
    };
    const runtime = runtimes[language];

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const upstream = await fetch(pistonUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          files: [{ name: language === 'python' ? 'main.py' : language === 'java' ? 'Main.java' : language === 'cpp' ? 'main.cpp' : language === 'csharp' ? 'Program.cs' : language === 'php' ? 'main.php' : 'main.js', content: code }],
        }),
        signal: controller.signal,
        cache: 'no-store',
      });
      const data = await upstream.json().catch(() => null);
      if (!upstream.ok || !data) {
        return NextResponse.json({ error: 'Execution runtime is unavailable.' }, { status: 502 });
      }
      const run = data.run || {};
      const compile = data.compile || {};
      const stdout = typeof run.stdout === 'string' ? run.stdout : '';
      const stderr = typeof run.stderr === 'string' ? run.stderr : '';
      const compileOutput = typeof compile.output === 'string' ? compile.output : '';
      const combined = stdout + stderr + compileOutput;
      if (bytes(combined) > MAX_OUTPUT_BYTES) {
        return NextResponse.json({ error: 'Execution output exceeded the 1 MB limit.' }, { status: 413 });
      }
      return NextResponse.json({ stdout, stderr, compileOutput, code: run.code ?? null });
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Execution timed out after 8 seconds.' }, { status: 408 });
    }
    return NextResponse.json({ error: 'Invalid execution request.' }, { status: 400 });
  }
}
