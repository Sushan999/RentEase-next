import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET reviews for a property
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        propertyId: Number(propertyId),
        approved: true,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Create new review (Tenants only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "LANDLORD" && session.user.role !== "TENANT")
    ) {
      return NextResponse.json(
        { error: "Unauthorized - Only landlord or tenant access allowed" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { propertyId, rating, comment } = data;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if tenant has completed booking for this property
    const completedBooking = await prisma.booking.findFirst({
      where: {
        tenantId: Number(session.user.id),
        propertyId: Number(propertyId),
        // status: "APPROVED",
      },
    });

    if (!completedBooking) {
      return NextResponse.json(
        { error: "You can only review properties you have rented" },
        { status: 403 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        tenantId_propertyId: {
          tenantId: Number(session.user.id),
          propertyId: Number(propertyId),
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this property" },
        { status: 409 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        propertyId: Number(propertyId),
        tenantId: Number(session.user.id),
        rating: parseInt(rating),
        comment: comment || null,
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
