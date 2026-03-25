import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const ranges = formData.get("ranges") as string; // JSON: [[0,2],[3,5]]
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();
    
    let pageRanges: number[][];
    try {
      pageRanges = JSON.parse(ranges || "[[0," + (totalPages - 1) + "]]");
    } catch {
      pageRanges = [[0, totalPages - 1]];
    }

    const pdfs: Uint8Array[] = [];
    
    for (const [start, end] of pageRanges) {
      const splitPdf = await PDFDocument.create();
      const pages = await splitPdf.copyPages(pdfDoc, pdfDoc.getPageIndices().filter((_, i) => i >= start && i <= end));
      pages.forEach(page => splitPdf.addPage(page));
      pdfs.push(await splitPdf.save());
    }

    // If single PDF, return directly
    if (pdfs.length === 1) {
      return new NextResponse(pdfs[0], {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=split.pdf",
        },
      });
    }

    // If multiple PDFs, return as base64 array
    return NextResponse.json({
      files: pdfs.map((pdf, i) => ({
        name: `split_${start}_${end}.pdf`,
        data: Buffer.from(pdf).toString("base64"),
      })),
    });
  } catch (error) {
    console.error("PDF split error:", error);
    return NextResponse.json({ error: "Failed to split PDF" }, { status: 500 });
  }
}
