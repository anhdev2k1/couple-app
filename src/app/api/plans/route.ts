import { NextResponse } from "next/server";
import {
  getPlans,
  addPlan,
  updatePlan,
  deletePlan,
  getUpcomingPlans,
} from "@/app/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const upcoming = searchParams.get("upcoming");

  if (upcoming === "true") {
    const plans = await getUpcomingPlans();
    return NextResponse.json(plans);
  }

  const plans = await getPlans();
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPlan = await addPlan(body);
  return NextResponse.json(newPlan, { status: 201 });
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const updatedPlan = await updatePlan(id, body);

  if (!updatedPlan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  return NextResponse.json(updatedPlan);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await deletePlan(id);
  return new NextResponse(null, { status: 204 });
}
