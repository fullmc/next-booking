import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        id: params.id,
        user_id: user.id
      },
      include: {
        activity: true
      }
    });

    if (!reservation) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 });
    }

    // Mise à jour du statut de la réservation
    await prisma.reservation.update({
      where: { id: params.id },
      data: { status: false }
    });

    // Mise à jour du nombre de places disponibles
    await prisma.activity.update({
      where: { id: reservation.activity_id },
      data: {
        available_places: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Réservation annulée avec succès" 
    });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Erreur serveur" 
    }, { 
      status: 500 
    });
  }
} 