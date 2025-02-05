import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/activities
export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        type: true,
      },
      orderBy: { datetime_debut: 'desc' }
    });
    return NextResponse.json(activities);
  } catch (error) {
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