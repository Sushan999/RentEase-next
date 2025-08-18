//properties/my-properties
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET landlord's owneed properties
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "LANDLORD" && session.user.role !== "TENANT") {
      return NextResponse.json(
        { error: "Forbidden - Only landlord or tenant access allowed" },
        { status: 403 }
      );
    }

    const properties = await prisma.property.findMany({
      where: {
        landlordId: Number(session.user.id),
      },
      include: {
        images: {
          select: {
            url: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching landlord properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
