import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const quality = parseInt(formData.get("quality") as string) || 80;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // For compression, we return the base64 directly
    // Client will handle the compression
    const base64 = Buffer.from(uint8Array).toString("base64");

    return NextResponse.json({ 
      original: base64,
      quality,
      message: "Use client-side compression for best results"
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
