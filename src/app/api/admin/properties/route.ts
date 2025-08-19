// src/app/api/admin/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// TO Fetch all properties (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const properties = await prisma.property.findMany({
      include: {
        landlord: {
          select: {
            name: true,
            email: true,
          },
        },
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

// To Approve or reject a property
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const { propertyId, status } = await request.json();

    if (!propertyId || typeof status !== "boolean") {
      return NextResponse.json(
        { error: "Property ID and status (true/false) are required" },
        { status: 400 }
      );
    }

    // Map boolean status to Propertystatus enum
    const approvedStatus = status ? "APPROVED" : "REJECTED";

    const updated = await prisma.property.update({
      where: { id: Number(propertyId) },
      data: { approved: approvedStatus },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating property status:", error);
    return NextResponse.json(
      { error: "Failed to update property status" },
      { status: 500 }
    );
  }
}
