import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

// To Update booking status (Landlord or Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(params.id) },
      include: {
        property: {
          include: {
            landlord: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check permissions
    const canUpdate =
      session.user.role === "ADMIN" ||
      (booking.property &&
        booking.property.landlordId === Number(session.user.id)) ||
      booking.tenantId === Number(session.user.id);

    if (!canUpdate) {
      return NextResponse.json(
        { error: "Forbidden - Cannot update this booking" },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { status } = data;

    // Validate status transition
    const validStatuses = Object.values(BookingStatus);
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking status" },
        { status: 400 }
      );
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(params.id) },
      data: { status },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property: {
          include: {
            landlord: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            images: {
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE booking (Tenant or Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(params.id) },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check permissions (tenant can only delete their own bookings)
    const canDelete =
      session.user.role === "ADMIN" ||
      booking.tenantId === Number(session.user.id);

    if (!canDelete) {
      return NextResponse.json(
        { error: "Forbidden - Cannot delete this booking" },
        { status: 403 }
      );
    }

    // Only allow deletion if booking is still pending
    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only delete pending bookings" },
        { status: 400 }
      );
    }

    await prisma.booking.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
