import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export const runtime = 'nodejs';

const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 100 * 1024 * 1024;

export async function POST(
  request: NextRequest
) {
  try {
    const form =
      await request.formData();

    const files =
      form
        .getAll('files')
        .filter(
          (value): value is File =>
            value instanceof File
        );

    if (files.length < 2) {
      return NextResponse.json(
        {
          error:
            'Select at least two PDF files.',
        },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        {
          error:
            'A maximum of 10 PDF files can be merged.',
        },
        { status: 400 }
      );
    }

    const totalBytes =
      files.reduce(
        (sum, file) =>
          sum + file.size,
        0
      );

    if (
      totalBytes >
      MAX_TOTAL_BYTES
    ) {
      return NextResponse.json(
        {
          error:
            'The selected PDFs exceed the 100 MB limit.',
        },
        { status: 413 }
      );
    }

    const output =
      await PDFDocument.create();

    for (
      const file of files
    ) {
      const input =
        await PDFDocument.load(
          await file.arrayBuffer()
        );

      const pages =
        await output.copyPages(
          input,
          input.getPageIndices()
        );

      pages.forEach((page) =>
        output.addPage(page)
      );
    }

    const bytes =
      await output.save({
        useObjectStreams: true,
      });

    return new NextResponse(
      bytes as BodyInit,
      {
        status: 200,
        headers: {
          'Content-Type':
            'application/pdf',
          'Content-Disposition':
            'attachment; filename="merged.pdf"',
          'Cache-Control':
            'no-store',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'PDF merge failed.',
      },
      { status: 422 }
    );
  }
}
