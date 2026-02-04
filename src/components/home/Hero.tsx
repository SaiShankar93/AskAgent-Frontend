'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser, SignUpButton } from '@clerk/nextjs';

export default function Hero() {
  const { isSignedIn } = useUser();
  const [typedText, setTypedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = [
    'Transform websites into AI assistants',
    'Build RAG-powered chatbots instantly',
    'Get intelligent answers from your data',
    'Deploy conversational AI in minutes',
  ];

  // Typewriter effect
  useEffect(() => {
    const targetText = texts[currentTextIndex];
    if (typedText === targetText) {
      const timeout = setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setTypedText('');
      }, 2000);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setTypedText(targetText.substring(0, typedText.length + 1));
    }, 80);

    return () => clearTimeout(timeout);
  }, [typedText, currentTextIndex, texts]);

  const features = [
    { icon: Sparkles, text: 'AI-Powered', gradient: 'from-slate-900 to-slate-700' },
    { icon: Zap, text: 'Lightning Fast', gradient: 'from-gray-900 to-gray-700' },
    { icon: Shield, text: 'Secure & Private', gradient: 'from-slate-800 to-slate-600' },
    { icon: Globe, text: 'Any Website', gradient: 'from-gray-800 to-gray-600' },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center bg-white dark:bg-gray-950">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.08),_transparent_50%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] bg-gradient-to-b from-gray-100/60 to-transparent dark:from-white/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium tracking-wide uppercase dark:bg-white/10 dark:text-gray-200 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Built for thoughtful AI experiences</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-gray-900 dark:text-white">
              <span className="block">AskAgent</span>
              <span className="block mt-3 text-gray-700 dark:text-gray-200 min-h-[120px]">
                {typedText}<span className="animate-pulse text-gray-400">|</span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              Give every visitor a refined, concierge-like experience. AskAgent turns your content into a calm,
              intelligent assistant that feels native to your brand.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-gray-900/70 border border-gray-200/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                  >
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {isSignedIn ? (
                <Link href="/dashboard">
                  <button className="group relative px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              ) : (
                <>
                  <SignUpButton mode="modal">
                    <button className="group relative px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </SignUpButton>
                  <Link href="#how-it-works">
                    <button className="px-8 py-4 border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white transition-all duration-300">
                      See How It Works
                    </button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(15,23,42,0.18)] bg-white/90 dark:bg-gray-900/70 backdrop-blur border border-gray-200/60 dark:border-white/10">
              <Image
                src="/chat-interface-mockup.svg"
                alt="Chat interface preview"
                width={640}
                height={480}
                className="w-full h-auto"
                priority
              />
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200/60 dark:border-white/10"
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Live Responses</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200/60 dark:border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white dark:text-gray-900" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Security</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Enterprise-grade</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
