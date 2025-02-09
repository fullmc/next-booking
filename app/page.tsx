'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FlipText } from '@/components/flip-text';
// import { RetroGrid } from '@/components/retro-grid';
import { Ripple } from '@/components/ripple';
import { MagicCard } from '@/components/magic-card';
import './layout.css';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      {/* <RetroGrid lightLineColor="white" cellSize={200}/> */}
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
            Et si vous plongiez dans des vies que vous ne connaissez qu'à moitié... ou que vous préférez ignorer ?
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
      <Ripple mainCircleSize={300} mainCircleOpacity={0.5} numCircles={10}/>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex h-[500px] w-full justify-center gap-4 lg:h-[250px] lg:flex-row">
          <MagicCard gradientColor="#0A1F4E" className="flex-col items-center justify-center text-2xl px-6 max-w-sm text-black">
            <h3 className="font-medium pb-6 tracking-wide transition-colors duration-500 group-hover:text-blue-500">Immersion totale</h3>
            <p className="text-xl transition-colors duration-500 group-hover:text-neutral-300">Vivez des scénarios si réalistes que vous oublierez la frontière entre jeu et réalité. Saurez-vous tenir jusqu'au bout ?</p>
          </MagicCard>
          <MagicCard gradientColor="#C0C0C0" className="flex-col items-center justify-center text-2xl px-6 max-w-sm text-black">
            <h3 className="font-medium pb-6 tracking-wide transition-colors duration-500 group-hover:text-neutral-950">Technologie avancée</h3>
            <motion.p 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xl transition-colors duration-500 group-hover:text-neutral-300"
            >
              Explorez des réalités cachées et percevez le monde sous un angle totalement nouveau. Prêts à voir l'invisible ?
            </motion.p>
          </MagicCard>
          <MagicCard gradientColor="#8B0000" className="flex-col items-center justify-center text-2xl px-6 max-w-sm text-black">
            <h3 className="font-medium pb-6 tracking-wide transition-colors duration-500 group-hover:text-red-500">Plongez dans l'abîme</h3>
            <p className="text-xl transition-colors duration-500 group-hover:text-neutral-300">Du refuge apaisant à l’horreur pure : repoussez vos limites, jusqu'à ce que le courage devienne une question de survie ...</p>
          </MagicCard>
        </div>
      </motion.div>
    </div>
  );           
}