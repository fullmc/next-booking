import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "node:fs";
import path from "node:path";

// GET /api/activities
export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        type: true,
      },
      orderBy: { datetime_debut: 'desc' }
    });
    const publicDir = path.join(process.cwd(), "public");

    const resolveImage = (name: string, id: string, dbImage?: string | null) => {
      const defaultPath = "/activities/default.jpg";
      const isValidPublicPath = (p: string) => p.startsWith("/") && fs.existsSync(path.join(publicDir, p));

      if (dbImage && typeof dbImage === "string" && isValidPublicPath(dbImage)) {
        return dbImage;
      }

      const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const candidates = [
        `/activities/${id}.jpg`,
        `/activities/${id}.jpeg`,
        `/activities/${id}.png`,
        `/activities/${id}.webp`,
        `/activities/${id}.avif`,
        `/activities/${slug}.jpg`,
        `/activities/${slug}.jpeg`,
        `/activities/${slug}.png`,
        `/activities/${slug}.webp`,
        `/activities/${slug}.avif`,
      ];

      for (const candidate of candidates) {
        if (isValidPublicPath(candidate)) return candidate;
      }

      return defaultPath;
    };

    const activitiesWithImage = activities.map((a) => ({
      ...a,
      image: resolveImage(a.name, a.id, a.image),
    }));

    return NextResponse.json(activitiesWithImage);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: "Erreur lors de la récupération des activités" }, { status: 500 });
  }
}

// POST /api/activities
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Vérification explicite du rôle ADMIN
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Vérifier dans la base de données si l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé - Rôle ADMIN requis" }, { status: 403 });
    }

    const data = await request.json();
    console.log('Données reçues:', data);

    const activity = await prisma.activity.create({
      data: {
        name: data.name,
        description: data.description,
        available_places: parseInt(data.available_places),
        duration: parseInt(data.duration),
        datetime_debut: new Date(data.datetime_debut),
        typeId: data.typeId,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Erreur complète:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la création',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 