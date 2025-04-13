import { NextResponse } from "next/server";
import { getCoupleData, updateCoupleData } from "@/app/lib/data";

export async function GET() {
  const coupleData = getCoupleData();
  return NextResponse.json(coupleData);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updatedData = updateCoupleData(body);
  return NextResponse.json(updatedData);
}
