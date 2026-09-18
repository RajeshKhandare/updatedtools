import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 100 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const password = form.get('password');
    const operation = form.get('operation');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'A PDF file is required.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: 'PDF exceeds the 100 MB limit.' },
        { status: 413 }
      );
    }

    if (
      typeof password !== 'string' ||
      !password
    ) {
      return NextResponse.json(
        { error: 'A password is required.' },
        { status: 400 }
      );
    }

    if (
      operation !== 'protect' &&
      operation !== 'unlock'
    ) {
      return NextResponse.json(
        { error: 'Unsupported PDF password operation.' },
        { status: 400 }
      );
    }

    const { createPdfToolkit } =
      await import('pdfstudio');

    const toolkit =
      await createPdfToolkit();

    const input = new Uint8Array(
      await file.arrayBuffer()
    );

    const output =
      operation === 'protect'
        ? await toolkit.lock(input, {
            userPassword: password,
            ownerPassword: password,
            keyLength: 256,
            permissions: {
              print: 'full',
              modify: 'none',
              extract: false,
              accessibility: true,
            },
          })
        : await toolkit.unlock(input, {
            password,
          });

    const filename =
      operation === 'protect'
        ? 'protected.pdf'
        : 'unlocked.pdf';

    return new NextResponse(
      output as BodyInit,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition':
            'attachment; filename="' + filename + '"',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'PDF password operation failed.';

    return NextResponse.json(
      { error: message },
      { status: 422 }
    );
  }
}
