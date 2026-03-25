import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      let image;
      
      if (file.type === "image/png") {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
        image = await pdfDoc.embedJpg(arrayBuffer);
      } else {
        continue; // Skip unsupported formats
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=images.pdf",
      },
    });
  } catch (error) {
    console.error("Image to PDF error:", error);
    return NextResponse.json({ error: "Failed to convert images to PDF" }, { status: 500 });
  }
}
