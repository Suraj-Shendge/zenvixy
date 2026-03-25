import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length < 2) {
      return NextResponse.json({ error: "At least 2 PDF files required" }, { status: 400 });
    }

    const { PDFDocument } = await import("pdf-lib");
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    return NextResponse.json({ pdf: pdfBase64 });
  } catch (error) {
    console.error("Error merging PDFs:", error);
    return NextResponse.json({ error: "Failed to merge PDFs" }, { status: 500 });
  }
}
