'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser, SignUpButton } from '@clerk/nextjs';

export default function Hero() {
  const { isSignedIn, isLoaded } = useUser();
  const [typedText, setTypedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = [
    'Transform websites into AI assistants',
    'Build RAG-powered chatbots instantly',
    'Get intelligent answers from your data',
    'Deploy conversational AI in minutes'
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
    { icon: Sparkles, text: 'AI-Powered', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Zap, text: 'Lightning Fast', gradient: 'from-purple-500 to-pink-500' },
    { icon: Shield, text: 'Secure & Private', gradient: 'from-orange-500 to-red-500' },
    { icon: Globe, text: 'Any Website', gradient: 'from-green-500 to-emerald-500' }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Powered by OpenAI & RAG Technology
              </span>
            </motion.div> */}

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="block bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                AskAgent
              </span>
              <span className="block mt-2 text-gray-900 dark:text-white min-h-[120px]">
                {typedText}<span className="animate-pulse text-primary-500">|</span>
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Transform any website or document into an intelligent AI assistant. 
              Powered by advanced RAG technology, OpenAI, and vector search for accurate, context-aware responses.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
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
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>
              ) : (
                <SignUpButton mode="modal">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </SignUpButton>
              )}
              
              <a href="#how-it-works">
                <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  See How It Works
                </button>
              </a>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8">
              {/* Chat Interface Mockup */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">AI Assistant</h3>
                    <p className="text-sm text-gray-500">Always ready to help</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-lg">
                      What services do you offer?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-900 dark:text-white">Based on your content, we offer comprehensive web development, AI integration, and custom software solutions. Would you like to know more about any specific service?</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[70%] shadow-lg">
                      Tell me about AI integration
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-secondary-500/10 pointer-events-none" />
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
            
            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-6 -left-6 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-white">⚡ Real-time Responses</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-white">🎯 Context-Aware</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
