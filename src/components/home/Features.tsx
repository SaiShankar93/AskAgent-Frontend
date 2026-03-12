'use client';

import { Brain, Database, Sparkles, Zap, Layers, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Brain,
    title: 'Advanced RAG Technology',
    description:
      'Retrieval-Augmented Generation ensures accurate, context-aware responses by combining AI with your specific knowledge base.',
    gradient: 'from-indigo-500 to-blue-500',
    glowColor: 'group-hover:shadow-indigo-500/20 dark:group-hover:shadow-indigo-500/10',
    borderHover: 'group-hover:border-indigo-300 dark:group-hover:border-indigo-500/30',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-500',
  },
  {
    icon: Database,
    title: 'Vector Search with Qdrant',
    description:
      'Lightning-fast semantic search powered by Qdrant vector database for instant, relevant information retrieval.',
    gradient: 'from-violet-500 to-purple-500',
    glowColor: 'group-hover:shadow-violet-500/20 dark:group-hover:shadow-violet-500/10',
    borderHover: 'group-hover:border-violet-300 dark:group-hover:border-violet-500/30',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-500',
  },
  {
    icon: Sparkles,
    title: 'OpenAI Integration',
    description:
      'Powered by OpenAI with automatic model fallback for uninterrupted service and intelligent responses.',
    gradient: 'from-amber-500 to-orange-500',
    glowColor: 'group-hover:shadow-amber-500/20 dark:group-hover:shadow-amber-500/10',
    borderHover: 'group-hover:border-amber-300 dark:group-hover:border-amber-500/30',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Web Scraping',
    description:
      'Intelligent web content extraction with smart filtering, markdown conversion, and automatic content optimization.',
    gradient: 'from-emerald-500 to-teal-500',
    glowColor: 'group-hover:shadow-emerald-500/20 dark:group-hover:shadow-emerald-500/10',
    borderHover: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-500/30',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
  },
  {
    icon: Layers,
    title: 'Document Processing',
    description:
      'Automatic processing of PDFs, Word documents, and text files with intelligent chunking for optimal retrieval.',
    gradient: 'from-rose-500 to-pink-500',
    glowColor: 'group-hover:shadow-rose-500/20 dark:group-hover:shadow-rose-500/10',
    borderHover: 'group-hover:border-rose-300 dark:group-hover:border-rose-500/30',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Secure & Scalable',
    description:
      'Enterprise-grade security with MongoDB, Clerk authentication, and scalable architecture for any workload.',
    gradient: 'from-cyan-500 to-blue-500',
    glowColor: 'group-hover:shadow-cyan-500/20 dark:group-hover:shadow-cyan-500/10',
    borderHover: 'group-hover:border-cyan-300 dark:group-hover:border-cyan-500/30',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-500',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-28 lg:py-36"
    >
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        {/* Subtle accent blobs */}
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-200/20 blur-[120px] dark:bg-indigo-500/5" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-violet-200/20 blur-[120px] dark:bg-violet-500/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center lg:mb-20"
        >
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
              Powerful Features
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Enterprise-grade AI technology stack for intelligent conversations
          </p>
        </motion.div>

        {/* ── Feature Grid ── */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="group relative"
            >
              {/* Hover glow underneath */}
              <div
                className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-[0.07] dark:group-hover:opacity-[0.12]`}
              />

              {/* Card */}
              <div
                className={`relative h-full rounded-2xl border border-gray-200/70 bg-white/70 p-7 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${feature.glowColor} ${feature.borderHover} dark:border-white/[0.08] dark:bg-white/[0.03]`}
              >
                {/* Icon badge */}
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  style={{
                    boxShadow: undefined,
                  }}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-[0.94rem] leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
