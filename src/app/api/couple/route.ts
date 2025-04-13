// app/api/couple/route.ts
import { NextResponse } from "next/server";
import { getCoupleData, updateCoupleData } from "@/app/lib/data";

export async function GET() {
  const coupleData = await getCoupleData(); // Hàm giờ là async
  return NextResponse.json(coupleData);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updatedData = await updateCoupleData(body); // Hàm giờ là async
  return NextResponse.json(updatedData);
}
