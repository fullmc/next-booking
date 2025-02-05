import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

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
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const data = await req.json();
    const activity = await prisma.activity.create({ data });
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de l'activité" }, { status: 500 });
  }
} 