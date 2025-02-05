import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const activityTypes = await prisma.activityType.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(activityTypes);
  } catch (error) {
    console.error('Erreur lors de la récupération des types d\'activités:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des types d\'activités' },
      { status: 500 }
    );
  }
}