import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Modification du profil
export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { first_name, last_name, email } = await req.json();
    const user = await prisma.user.update({
      where: { email: session.user?.email as string },
      data: { first_name, last_name, email },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}

// Suppression du profil
export async function DELETE() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await prisma.user.delete({
      where: { email: session.user?.email as string },
    });

    return NextResponse.json({ message: "Compte supprimé" });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
  }
} 