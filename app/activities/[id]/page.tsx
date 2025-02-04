import { ArrowLeft, Clock, MapPin, Euro } from "lucide-react"
import Link from "next/link"

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  // Simulons une activité (à remplacer par les vraies données)
  const activity = {
    id: params.id,
    title: "Cours de Tennis",
    description: "Apprenez le tennis avec des professionnels qualifiés. Nos cours sont adaptés à tous les niveaux, du débutant à l'avancé. Le matériel est fourni pour les débutants.",
    price: 45,
    duration: "1h30",
    location: "Paris 15ème",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1600&q=80",
    instructor: "Jean Dupont",
    maxParticipants: 6,
    level: "Tous niveaux",
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/activities" className="flex items-center gap-2 mb-6 text-primary hover:underline">
        <ArrowLeft size={20} />
        Retour aux activités
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{activity.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{activity.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>{activity.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Euro size={20} />
              <span>{activity.price}€</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p>{activity.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Informations</h2>
            <ul className="space-y-2">
              <li>🎓 Instructeur : {activity.instructor}</li>
              <li>👥 Nombre maximum de participants : {activity.maxParticipants}</li>
              <li>📊 Niveau requis : {activity.level}</li>
            </ul>
          </div>

          <button className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Réserver cette activité
          </button>
        </div>
      </div>
    </div>
  )
} 