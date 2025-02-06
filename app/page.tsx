'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FlipText } from '@/components/flip-text';
import { RetroGrid } from '@/components/retro-grid';
import { MagicCard } from '@/components/magic-card';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <RetroGrid lightLineColor="white" cellSize={200}/>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-20"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <FlipText word="Vivez l'Expérience ultime" className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500" />
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400"
          >
            Plongez dans un univers où la réalité rencontre la fiction. 
            Des expériences uniques qui repoussent les limites de votre imagination.
          </motion.p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => router.push('/activities')}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white/10 rounded-full hover:bg-zinc-200 hover:text-black transition-all duration-300"
          >
            <span className="text-lg">Découvrir les activités</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="container mx-auto px-4 py-20"
      >
        <div className="flex h-[500px] w-full flex-col gap-4 lg:h-[250px] lg:flex-row">
          <MagicCard gradientColor="blue" className="flex-col items-center justify-center text-2xl px-6">
            <h3 className="font-bold pb-6 text-black">Immersion Totale</h3>
            <p className="text-xl text-gray-400 ">Des scénarios élaborés qui vous transportent dans un autre monde.</p>
          </MagicCard>
          <MagicCard className="flex-col items-center justify-center text-2xl px-6">
            <h3 className="font-bold pb-6 text-black">Technologie Avancée</h3>
            <p className="text-xl text-gray-400">Les dernières innovations au service de votre expérience.</p>
          </MagicCard>
          <MagicCard className="flex-col items-center justify-center text-2xl px-6">
            <h3 className="font-bold pb-6 text-black">Sécurité Garantie</h3>
            <p className="text-xl text-gray-400">Une équipe d'experts veille à votre sécurité pendant toute l'expérience.</p>
          </MagicCard>
        </div>
      </motion.div>

      {/* Background Effect */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black"></div>
    </div>
  );
}