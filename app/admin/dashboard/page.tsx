import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import React from "react";

async function getAdminStats() {
  const [userCount, reservationCount, activeReservations] = await Promise.all([
    prisma.user.count(),
    prisma.reservation.count(),
    prisma.reservation.count({
      where: {
        status: true
      }
    })
  ]);
  return {
    userCount,
    reservationCount,
    activeReservations
  };
}

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      reservations: {
        select: {
          id: true,
          status: true,
          booking_date: true,
          // Ajoutez d'autres champs de réservation selon vos besoins
        },
      },
    },
    orderBy: {
      last_name: 'asc',
    },
  });
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getAdminStats();
  const users = await getUsers();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500">Utilisateurs totaux</h2>
          <p className="text-3xl font-bold">{stats.userCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500">Réservations totales</h2>
          <p className="text-3xl font-bold">{stats.reservationCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500">Réservations actives</h2>
          <p className="text-3xl font-bold">{stats.activeReservations}</p>
        </div>
      </div>

      <h1 className="text-xl font-bold my-6">Liste des Utilisateurs</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réservations Confirmées</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réservations Annulées</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              const confirmedReservations = user.reservations.filter(r => r.status === true).length;
              const canceledReservations = user.reservations.filter(r => r.status === false).length;
              
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {confirmedReservations}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {canceledReservations}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 