// properties/
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PropertyType, PropertyStatus } from "@prisma/client";

// GET all properties with search and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const propertyType = searchParams.get(
      "propertyType"
    ) as PropertyType | null;
    const bedrooms = searchParams.get("bedrooms")
      ? parseInt(searchParams.get("bedrooms")!)
      : undefined;
    const bathrooms = searchParams.get("bathrooms")
      ? parseInt(searchParams.get("bathrooms")!)
      : undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";
    const status = searchParams.get("status") as PropertyStatus | null;

    const where: any = {
      ...(status
        ? { approved: status }
        : { approved: PropertyStatus.APPROVED }),
      available: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }

    if (location) {
      where.location = { contains: location };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.rent = {};
      if (minPrice !== undefined) where.rent.gte = minPrice;
      if (maxPrice !== undefined) where.rent.lte = maxPrice;
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (bedrooms) {
      where.bedrooms = bedrooms;
    }

    if (bathrooms) {
      where.bathrooms = bathrooms;
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    // Calculate average rating for each property
    const propertiesWithRating = properties.map((property) => ({
      ...property,
      averageRating:
        property.reviews.length > 0
          ? property.reviews.reduce((sum, review) => sum + review.rating, 0) /
            property.reviews.length
          : 0,
      totalReviews: property.reviews.length,
    }));

    return NextResponse.json(propertiesWithRating);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

// POST - Create new property (Landlords only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "LANDLORD") {
      return NextResponse.json(
        { error: "Unauthorized - Landlord access required" },
        { status: 401 }
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
      images,
    } = data;

    // Create property
    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        rent: parseFloat(rent),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: area ? parseFloat(area) : null,
        propertyType: propertyType as PropertyType,
        amenities,
        availableDate: new Date(availableDate),
        landlordId: Number(session.user.id),
        approved: PropertyStatus.PENDING,
        images: {
          create:
            images?.map((img: { url: string; alt?: string }) => ({
              url: img.url,
              alt: img.alt || "",
            })) || [],
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
