'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';
import { LineShadowText } from '../components/magicui/line-shadow-text';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-balance text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          <LineShadowText className="italic" shadowColor="white">
            404
          </LineShadowText>
        </h1>
        <motion.h2 
          className="text-3xl font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Page non trouvée
        </motion.h2>
        <motion.p 
          className="text-gray-400 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 