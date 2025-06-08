import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const res = await fetch(
    `https://formulae.brew.sh/api/formula/${encodeURIComponent(slug)}.json`
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `Formula ${slug} not found` },
      { status: 404 }
    );
  }

  const data = await res.json();

  return NextResponse.json(data);
}
