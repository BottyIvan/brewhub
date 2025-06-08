import { NextResponse } from "next/server";

type FormulaItem = {
  name?: string;
  full_name?: string;
  desc?: string;
  [key: string]: unknown;
};

export async function POST(req: Request) {
  const body = await req.json();
  const query = body.query ?? "";
  const page = body.page ?? "1";
  const limit = body.limit ?? "10";
  const formulas: string[] | undefined = body.formulas;

  const res = await fetch("https://formulae.brew.sh/api/formula.json");

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch formulas" },
      { status: 500 }
    );
  }

  let data = await res.json();

  // If formulas is present, filter only those
  if (Array.isArray(formulas) && formulas.length > 0) {
    data = data.filter(
      (item: FormulaItem) =>
        typeof item.name === "string" && formulas.includes(item.name)
    );
  } else {
    // Otherwise, apply the query filter
    data = data.filter((item: FormulaItem) => {
      if (query) {
        const searchQuery = query.toLowerCase();
        return (
          (item.name ?? "").toLowerCase().includes(searchQuery) ||
          (item.full_name ?? "").toLowerCase().includes(searchQuery) ||
          (item.desc ?? "").toLowerCase().includes(searchQuery)
        );
      }
      return true; // If no query, return all items
    });
  }

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
