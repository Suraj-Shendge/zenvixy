import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const rangesParam = formData.get("ranges") as string;

    if (!file || !rangesParam) {
      return NextResponse.json({ error: "File and ranges required" }, { status: 400 });
    }

    const ranges = JSON.parse(rangesParam) as { from: number; to: number }[];
    const { PDFDocument } = await import("pdf-lib");
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const results: { name: string; pdf: string }[] = [];

    for (const range of ranges) {
      const subDoc = await PDFDocument.create();
      const indices: number[] = [];
      for (let i = range.from - 1; i < range.to; i++) {
        indices.push(i);
      }
      const copiedPages = await subDoc.copyPages(pdfDoc, indices);
      copiedPages.forEach(page => subDoc.addPage(page));
      const pdfBytes = await subDoc.save();
      results.push({
        name: `pages_${range.from}-${range.to}.pdf`,
        pdf: Buffer.from(pdfBytes).toString("base64")
      });
    }

    return NextResponse.json({ files: results });
  } catch (error) {
    console.error("Error splitting PDF:", error);
    return NextResponse.json({ error: "Failed to split PDF" }, { status: 500 });
  }
}
