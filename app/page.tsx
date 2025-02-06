'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FlipText } from '@/components/flip-text';
import { RetroGrid } from '@/components/retro-grid';
import { MagicCard } from '@/components/magic-card';
import './layout.css';

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
          <FlipText 
            word="Vivez l'Expérience ultime" 
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-200 via-zinc-300 to-gray-200 bg-clip-text text-transparent relative drop-shadow-[0_0_1.5rem_rgba(255,255,255,0.4)] filter backdrop-blur-sm"
          />

          
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
      >
        <div className="flex h-[500px] w-full justify-center gap-4 lg:h-[250px] lg:flex-row">
          <MagicCard gradientColor="white" className="flex-col items-center justify-center text-2xl px-6 max-w-sm  text-black">
            <h3 className="font-medium pb-6 tracking-wide">Immersion totale</h3>
            <p className="text-xl">Vivez des scénarios si réalistes que vous oublierez la frontière entre jeu et réalité. Saurez-vous tenir jusqu'au bout ?</p>
          </MagicCard>
          <MagicCard gradientColor="white" className="flex-col items-center justify-center text-2xl px-6 max-w-sm text-black">
            <h3 className="font-medium pb-6 tracking-wide">Technologie avancée</h3>
            <p className="text-xl">Explorez des réalités cachées et percevez le monde sous un angle totalement nouveau. Prêts à voir l'invisible ?</p>
          </MagicCard>
          <MagicCard gradientColor="white" className="flex-col items-center justify-center text-2xl px-6 max-w-sm text-black">
            <h3 className="font-medium pb-6 tracking-wide">Choisissez votre destin</h3>
            <p className="text-xl">Du confortable au brutal : ajustez chaque expérience à votre seuil de tolérance... si vous en avez le courage.</p>
          </MagicCard>
        </div>
      </motion.div>
    </div>
  );
}