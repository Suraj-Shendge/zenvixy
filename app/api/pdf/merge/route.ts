import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: "At least 2 PDF files are required" },
        { status: 400 }
      );
    }

    // Load the first PDF
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=merged.pdf",
      },
    });
  } catch (error) {
    console.error("PDF merge error:", error);
    return NextResponse.json(
      { error: "Failed to merge PDFs" },
      { status: 500 }
    );
  }
}
