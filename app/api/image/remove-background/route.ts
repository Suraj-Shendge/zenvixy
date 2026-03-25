import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file as base64 for client-side processing
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({
      success: true,
      originalSize: file.size,
      mimeType: file.type,
      dataUri: `data:${file.type};base64,${base64}`,
    });
  } catch (error) {
    console.error("Background removal prep error:", error);
    return NextResponse.json({ error: "Failed to prepare image" }, { status: 500 });
  }
}
