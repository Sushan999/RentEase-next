import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

// Gett bookings based on user role
export async function GET(request: NextRequest) {
  try {
    // Auto-complete bookings whose endDate has passed and status is APPROVED
    await prisma.booking.updateMany({
      where: {
        status: "APPROVED",
        endDate: { lt: new Date() },
      },
      data: {
        status: "COMPLETED",
      },
    });

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BookingStatus | null;

    let bookings;

    if (session.user.role === "LANDLORD") {
      // Landlords see bookings for their properties
      bookings = await prisma.booking.findMany({
        where: {
          property: {
            landlordId: Number(session.user.id),
          },
          ...(status ? { status } : {}),
        },
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
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Tenants see bookings they made
      bookings = await prisma.booking.findMany({
        where: {
          tenantId: Number(session.user.id),
          ...(status ? { status } : {}),
        },
        include: {
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
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

//  Create new booking (Tenants only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "TENANT") {
      return NextResponse.json(
        { error: "Only tenants can create bookings." },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { propertyId, startDate, endDate, message } = data;

    // Check if tenant already has a pending booking for this property
    const existingPending = await prisma.booking.findFirst({
      where: {
        propertyId: Number(propertyId),
        tenantId: Number(session.user.id),
        status: "PENDING",
      },
    });
    if (existingPending) {
      return NextResponse.json(
        { error: "You already have a pending booking for this property." },
        { status: 409 }
      );
    }

    // Check if property exists and is available
    const property = await prisma.property.findUnique({
      where: { id: Number(propertyId) },
      include: {
        landlord: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (!property.available || property.approved !== "APPROVED") {
      return NextResponse.json(
        { error: "Property is not available for booking" },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        propertyId: Number(propertyId),
        status: {
          in: ["APPROVED", "COMPLETED"],
        },
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } },
            ],
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } },
            ],
          },
          {
            AND: [
              { startDate: { gte: new Date(startDate) } },
              { endDate: { lte: new Date(endDate) } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { error: "Property is already booked for the selected dates" },
        { status: 409 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        propertyId: Number(propertyId),
        tenantId: Number(session.user.id),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        message: message || null,
        status: BookingStatus.PENDING,
      },
      include: {
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
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
