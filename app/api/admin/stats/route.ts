import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Non autorisé", { status: 401 });
  }

  const stats = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      _count: {
        select: {
          reservations: true
        }
      }
    }
  });

  return NextResponse.json(stats);
}