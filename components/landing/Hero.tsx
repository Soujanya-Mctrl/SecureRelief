'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-[800px] flex items-center justify-center overflow-hidden bg-gray-900 text-white">
      {/* Background Image / Overlay */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop')] 
        bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

      <div className="container relative z-10 px-4 md:px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm mb-6">
            <Activity className="mr-2 h-4 w-4 text-primary-foreground" />
            <span className="text-gray-200">Emergency Response System Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Immediate Aid Where It <span className="text-primary">Matters Most</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Providing rapid response resources to communities affected by natural disasters worldwide.
            We ensure 100% of public donations go directly to beneficiaries via smart contracts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base h-12 px-8 shadow-xl shadow-primary/20">
              Donate Now
            </Button>
            <Link href="/impact/hurricane-delta">
              <Button variant="outline" size="lg" className="text-base h-12 px-8 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                Track Fund Distribution
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
