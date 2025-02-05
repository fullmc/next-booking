import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
        available_places: data.available_places,
        duration: data.duration,
        datetime_debut: new Date(data.datetime_debut),
        typeId: data.typeId,
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

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'activité" },
      { status: 500 }
    );
  }
} 