import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  const res = await fetch(
    `https://formulae.brew.sh/api/formula/${encodeURIComponent(name)}.json`
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `Formula ${name} not found` },
      { status: 404 }
    );
  }

  const data = await res.json();

  return NextResponse.json(data);
}
