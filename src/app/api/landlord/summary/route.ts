import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = Number(session.user.id);

    const totalProperties = await prisma.property.count({
      where: { landlordId: userId },
    });
    const approvedProperties = await prisma.property.count({
      where: { landlordId: userId, approved: "APPROVED" },
    });
    const pendingBookings = await prisma.booking.count({
      where: { property: { landlordId: userId }, status: "PENDING" },
    });

    // Sum the 'rent' field from related property for approved bookings
    const revenueResult = await prisma.booking.findMany({
      where: { property: { landlordId: userId }, status: "APPROVED" },
      include: { property: { select: { rent: true } } },
    });
    const revenue = revenueResult.reduce(
      (sum, b) => sum + (b.property?.rent || 0),
      0
    );

    return NextResponse.json({
      totalProperties,
      approvedProperties,
      pendingBookings,
      revenue,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
