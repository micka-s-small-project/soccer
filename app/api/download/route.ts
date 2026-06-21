import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image from source");

    const blob = await response.blob();
    const headers = new Headers();

    headers.set("Content-Type", blob.type);
    headers.set("Content-Disposition", `attachment; filename="stadium_jumbotron.png"`);

    return new NextResponse(blob, { status: 200, headers });
  } catch (error) {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}