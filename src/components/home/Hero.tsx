'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield, Globe, MessageSquare, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, SignUpButton } from '@clerk/nextjs';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
};

const floatAnimation = {
  y: [0, -8, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
};

const floatAnimationSlow = {
  y: [0, -6, 0],
  transition: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
};

export default function Hero() {
  const { isSignedIn } = useUser();
  const [typedText, setTypedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = useMemo(
    () => [
      'Transform websites into AI assistants',
      'Build RAG-powered chatbots instantly',
      'Get intelligent answers from your data',
      'Deploy conversational AI in minutes',
    ],
    []
  );

  useEffect(() => {
    const targetText = texts[currentTextIndex];

    if (!isDeleting && typedText === targetText) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const speed = isDeleting ? 35 : 65;
    const timeout = setTimeout(() => {
      setTypedText(
        isDeleting
          ? targetText.substring(0, typedText.length - 1)
          : targetText.substring(0, typedText.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [typedText, currentTextIndex, isDeleting, texts]);

  const featurePills = [
    { icon: Sparkles, text: 'AI-Powered', color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { icon: Zap, text: 'Lightning Fast', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: Shield, text: 'Secure & Private', color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { icon: Globe, text: 'Any Website', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Aurora / Mesh Gradient Background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 dark:from-gray-950 dark:via-indigo-950/30 dark:to-violet-950/20" />

        {/* Animated aurora blobs */}
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 20, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-0 h-[480px] w-[480px] rounded-full bg-violet-400/20 dark:bg-violet-500/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 25, -15, 0], y: [0, -20, 25, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-300/15 dark:bg-amber-500/5 blur-[100px]"
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(99,102,241,0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── Left Column ── */}
          <motion.div variants={container} initial="hidden" animate="show">
            {/* Badge */}
            <motion.div variants={item} className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md dark:border-indigo-500/20 dark:bg-white/5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                </span>
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                  Powered by RAG + OpenAI
                </span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={item} className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
                AskAgent
              </span>
              <span className="mt-2 block min-h-[1.25em] text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-[2.75rem]">
                {typedText}
                <span className="ml-0.5 inline-block w-[3px] h-[1em] translate-y-[0.1em] animate-pulse rounded-sm bg-indigo-500" />
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={item}
              className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600 dark:text-gray-400"
            >
              Transform any website or document into an intelligent AI assistant.
              Powered by advanced RAG technology, OpenAI, and vector search for
              accurate, context-aware responses.
            </motion.p>

            {/* Feature pills */}
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
              {featurePills.map((pill, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors ${pill.bg} ${pill.border} ${pill.color}`}
                >
                  <pill.icon className="h-4 w-4" />
                  {pill.text}
                </span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <button className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98]">
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </button>
                </Link>
              ) : (
                <SignUpButton mode="modal">
                  <button className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98]">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </button>
                </SignUpButton>
              )}

              <a href="#how-it-works">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white/80 px-8 py-4 font-semibold text-gray-900 backdrop-blur-sm transition-all duration-300 hover:border-indigo-300 hover:bg-white hover:shadow-lg active:scale-[0.98] dark:border-gray-700 dark:bg-gray-900/60 dark:text-white dark:hover:border-indigo-500/50 dark:hover:bg-gray-900/80">
                  See How It Works
                </button>
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right Column — Chat Mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 blur-2xl dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-purple-500/10" />

            {/* Chat card */}
            <div className="relative rounded-2xl border border-white/40 bg-white/60 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl dark:border-white/[0.08] dark:bg-gray-900/60 dark:shadow-indigo-500/5 sm:p-8">
              {/* Header */}
              <div className="mb-5 flex items-center gap-3 border-b border-gray-200/60 pb-5 dark:border-white/10">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/30">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">AI Assistant</h3>
                  <p className="text-xs text-emerald-500 font-medium">Online — always ready</p>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {/* User message 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-3 text-sm text-white shadow-md shadow-indigo-500/20">
                    What services do you offer?
                  </div>
                </motion.div>

                {/* Bot message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-800 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                    Based on your content, we offer comprehensive web development, AI integration, and
                    custom software solutions. Would you like to know more about any specific service?
                  </div>
                </motion.div>

                {/* User message 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[70%] rounded-2xl rounded-tr-md bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-3 text-sm text-white shadow-md shadow-indigo-500/20">
                    Tell me about AI integration
                  </div>
                </motion.div>

                {/* Typing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="flex items-center gap-1.5 pl-1"
                >
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:300ms]" />
                </motion.div>
              </div>

              {/* Input bar mockup */}
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Ask anything...</span>
              </div>
            </div>

            {/* Floating badge — Real-time Responses */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5, ease: 'backOut' }}
              className="absolute -left-4 -top-4 z-10 sm:-left-6 sm:-top-5"
            >
              <motion.div
                animate={floatAnimation}
                className="flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-gray-800/90 dark:text-white"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Real-time Responses
              </motion.div>
            </motion.div>

            {/* Floating badge — Context-Aware */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5, ease: 'backOut' }}
              className="absolute -bottom-4 -right-4 z-10 sm:-bottom-5 sm:-right-6"
            >
              <motion.div
                animate={floatAnimationSlow}
                className="flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-gray-800/90 dark:text-white"
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                Context-Aware
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
