import { NextResponse } from "next/server";
import {
  getSavingCategories,
  addSavingCategory,
  updateSavingCategory,
  deleteSavingCategory,
} from "@/app/lib/data";

export async function GET() {
  const categories = getSavingCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newCategory = addSavingCategory(body);
  return NextResponse.json(newCategory, { status: 201 });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const updatedCategory = updateSavingCategory(id, body);

  if (!updatedCategory) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(updatedCategory);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  deleteSavingCategory(id);
  return new NextResponse(null, { status: 204 });
}
