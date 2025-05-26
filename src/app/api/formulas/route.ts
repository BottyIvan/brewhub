import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const page = body.page ?? "1";
  const limit = body.limit ?? "10";

  const res = await fetch("https://formulae.brew.sh/api/formula.json");

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch formulas" },
      { status: 500 }
    );
  }

  const data = await res.json();
  const pages = Math.ceil(data.length / parseInt(limit));
  if (parseInt(page) < 1 || parseInt(page) > pages) {
    return NextResponse.json({ error: "Page out of range" }, { status: 400 });
  }
  const paginatedData = data.slice(
    (parseInt(page) - 1) * parseInt(limit),
    parseInt(page) * parseInt(limit)
  );
  if (!paginatedData || paginatedData.length === 0) {
    return NextResponse.json({ error: "No formulas found" }, { status: 404 });
  }

  return NextResponse.json({
    data: paginatedData,
    page: parseInt(page),
    pages,
    limit: parseInt(limit),
    total: data.length,
  });
}
