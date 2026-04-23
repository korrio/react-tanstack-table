import { NextResponse } from "next/server";
import { updateBooking, deleteBooking } from "@/lib/booking-data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const bookingId = Number(id);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const updated = updateBooking(bookingId, body);
  if (!updated) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookingId = Number(id);

  const success = deleteBooking(bookingId);
  if (!success) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
