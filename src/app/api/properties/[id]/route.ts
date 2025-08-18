import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET single property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        images: true,
        reviews: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: {
            approved: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        bookings: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
          },
          where: {
            status: {
              in: ["APPROVED", "COMPLETED"],
            },
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const averageRating =
      property.reviews && property.reviews.length > 0
        ? property.reviews.reduce(
            (sum: number, review: { rating: number }) => sum + review.rating,
            0
          ) / property.reviews.length
        : 0;

    return NextResponse.json({
      ...property,
      averageRating,
      totalReviews: property.reviews ? property.reviews.length : 0,
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

// PUT - Update property (Owner or Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const property = await prisma.property.findUnique({
      where: { id: Number(params.id) },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Allow admins to edit any property landlords only their own
    if (
      session.user.role !== "ADMIN" &&
      property.landlordId !== Number(session.user.id)
    ) {
      return NextResponse.json(
        { error: "Forbidden - Can only edit your own properties" },
        { status: 403 }
      );
    }

    const data = await request.json();
    const {
      title,
      description,
      location,
      rent,
      bedrooms,
      bathrooms,
      area,
      propertyType,
      amenities,
      availableDate,
      available,
      images,
      approved,
    } = data;

    // Update property
    const updateData: any = {
      title,
      description,
      location,
      rent: rent ? parseFloat(rent) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      area: area ? parseFloat(area) : undefined,
      propertyType,
      amenities,
      availableDate: availableDate ? new Date(availableDate) : undefined,
      available: available !== undefined ? available : undefined,
    };
    if (approved) {
      updateData.approved = approved;
    }
    const updatedProperty = await prisma.property.update({
      where: { id: Number(params.id) },
      data: updateData,
      include: {
        images: true,
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Handle images update if provided
    if (images) {
      // Delete existing images
      await prisma.propertyImage.deleteMany({
        where: { propertyId: Number(params.id) },
      });

      // Create new images
      if (images.length > 0) {
        await prisma.propertyImage.createMany({
          data: images.map((img: { url: string; alt?: string }) => ({
            propertyId: Number(params.id),
            url: img.url,
            alt: img.alt || "",
          })),
        });
      }
    }

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

// DELETE property (Owner or Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const property = await prisma.property.findUnique({
      where: { id: Number(params.id) },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Check if user can delete this property
    if (property.landlordId !== Number(session.user.id)) {
      return NextResponse.json(
        { error: "Forbidden - Can only delete your own properties" },
        { status: 403 }
      );
    }

    // Delete property (CASCADE will handle related records)
    await prisma.property.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
