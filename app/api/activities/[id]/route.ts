import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "node:fs";
import path from "node:path";

// PUT /api/activities/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const data = await req.json();
    const activity = await prisma.activity.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        available_places: typeof data.available_places === 'string' ? parseInt(data.available_places) : data.available_places,
        duration: typeof data.duration === 'string' ? parseInt(data.duration) : data.duration,
        datetime_debut: new Date(data.datetime_debut),
        typeId: data.typeId,
        image: data.image && typeof data.image === 'string' && data.image.trim() !== ''
          ? data.image.trim()
          : '/activities/default.jpg',
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Erreur de mise à jour:', error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'activité" },
      { status: 500 }
    );
  }
}

// DELETE /api/activities/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await prisma.activity.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'activité" },
      { status: 500 }
    );
  }
}

// GET /api/activities/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const activity = await prisma.activity.findUnique({
      where: {
        id: params.id
      },
      include: {
        type: true,
      }
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activité non trouvée" },
        { status: 404 }
      );
    }

    const publicDir = path.join(process.cwd(), "public");
    const isValidPublicPath = (p: string) => p.startsWith("/") && fs.existsSync(path.join(publicDir, p));
    const defaultPath = "/activities/default.jpg";

    const slug = activity.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const candidates = [
      activity.image ?? "",
      `/activities/${activity.id}.jpg`,
      `/activities/${activity.id}.jpeg`,
      `/activities/${activity.id}.png`,
      `/activities/${activity.id}.webp`,
      `/activities/${activity.id}.avif`,
      `/activities/${slug}.jpg`,
      `/activities/${slug}.jpeg`,
      `/activities/${slug}.png`,
      `/activities/${slug}.webp`,
      `/activities/${slug}.avif`,
    ].filter(Boolean) as string[];

    const resolvedImage = candidates.find(isValidPublicPath) ?? defaultPath;

    return NextResponse.json({ ...activity, image: resolvedImage });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'activité" },
      { status: 500 }
    );
  }
} 