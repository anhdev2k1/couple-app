// app/api/savings/route.ts
import { NextResponse } from "next/server";
import {
  getSavings,
  addSaving,
  deleteSaving,
  getTotalSavings,
  getSavingsByMonth,
  updateSaving,
  getSavingCategories,
  getSavingsByCategory,
  getCurrentMonthSavings,
} from "@/app/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const total = searchParams.get("total");
  const byMonth = searchParams.get("byMonth");
  const byCategory = searchParams.get("byCategory");
  const categories = searchParams.get("categories");

  if (total === "true") {
    const totalAmount = getTotalSavings();
    return NextResponse.json({ total: totalAmount });
  }

  if (byMonth === "true") {
    const monthlySavings = getSavingsByMonth();
    return NextResponse.json(monthlySavings);
  }

  if (byCategory === "true") {
    const categorySavings = getSavingsByCategory();
    return NextResponse.json(categorySavings);
  }

  if (categories === "true") {
    const categories = getSavingCategories();
    return NextResponse.json(categories);
  }
  if (searchParams.get("currentMonth") === "true") {
    const currentMonthAmount = getCurrentMonthSavings();
    return NextResponse.json({ amount: currentMonthAmount });
  }
  const savings = getSavings();
  return NextResponse.json(savings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newSaving = addSaving(body);
  return NextResponse.json(newSaving, { status: 201 });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const updatedSaving = updateSaving(id, body);

  if (!updatedSaving) {
    return NextResponse.json({ error: "Saving not found" }, { status: 404 });
  }

  return NextResponse.json(updatedSaving);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  deleteSaving(id);
  return new NextResponse(null, { status: 204 });
}
