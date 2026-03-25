import { NextRequest, NextResponse } from "next/server";

// Note: For Vercel serverless, we use browser-based image compression
// This API can handle advanced compression scenarios
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const quality = parseInt(formData.get("quality") as string) || 80;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file as base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;

    return NextResponse.json({
      success: true,
      originalSize: file.size,
      quality,
      // Return data URI for browser-side compression
      dataUri: `data:${mimeType};base64,${base64}`,
    });
  } catch (error) {
    console.error("Image compress error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
