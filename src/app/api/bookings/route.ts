import { NextResponse } from "next/server";
import { getBookings, addBooking } from "@/lib/booking-data";

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return NextResponse.json(getBookings());
}

export async function POST(request: Request) {
  const body = await request.json();
  const newBooking = addBooking(body);
  return NextResponse.json(newBooking, { status: 201 });
}
