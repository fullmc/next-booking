import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Réserver une activité
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { activityId } = await request.json();

    // Utiliser une transaction pour garantir la cohérence des données
    const reservation = await prisma.$transaction(async (tx) => {
      // Vérifier si l'activité existe et a des places disponibles
      const activity = await tx.activity.findUnique({
        where: { id: activityId },
        include: { reservations: true }
      });

      if (!activity) {
        throw new Error("Activité non trouvée");
      }

      const activeReservations = activity.reservations.filter(r => r.status);
      if (activity.available_places <= activeReservations.length) {
        throw new Error("Plus de places disponibles");
      }

      const user = await tx.user.findUnique({
        where: { email: session.user.email || '' }
      });

      // Créer la réservation
      const newReservation = await tx.reservation.create({
        data: {
          user_id: user!.id,
          activity_id: activityId,
          status: true,
        },
      });

      // Mettre à jour le nombre de places disponibles
      await tx.activity.update({
        where: { id: activityId },
        data: {
          available_places: activity.available_places - 1
        },
      });

      return newReservation;
    });

    return NextResponse.json(reservation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Récupérer les réservations de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const reservations = await prisma.reservation.findMany({
      where: {
        user_id: user!.id,
      },
      include: {
        activity: {
          include: {
            type: true
          }
        },
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 

// Annuler une réservation
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    console.log('Annulation réservation:', { id: params.id, userEmail: session.user.email });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Utiliser une transaction pour la cohérence des données
    const updatedReservation = await prisma.$transaction(async (tx) => {
      // Vérifier que la réservation existe
      const reservation = await tx.reservation.findFirst({
        where: {
          id: params.id,
          user_id: user.id
        },
        include: {
          activity: true
        }
      });

      if (!reservation) {
        throw new Error("Réservation non trouvée");
      }

      // Mettre à jour le statut de la réservation
      const updated = await tx.reservation.update({
        where: { id: params.id },
        data: { status: false }
      });

      // Incrémenter le nombre de places disponibles
      await tx.activity.update({
        where: { id: reservation.activity_id },
        data: {
          available_places: {
            increment: 1
          }
        }
      });

      return updated;
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Erreur détaillée:', error);
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 