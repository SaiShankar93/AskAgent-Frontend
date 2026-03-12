'use client';

import { Globe, FileText, Bot, MessageSquare, Code2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  iconGradient: string;
  badgeColor: string;
  glowColor: string;
}

const steps: Step[] = [
  {
    icon: Globe,
    title: 'Enter Website URL',
    description:
      'Paste any website URL and our intelligent crawler automatically extracts, filters, and indexes all relevant content — no manual setup required.',
    iconGradient: 'from-indigo-500 to-violet-500',
    badgeColor: 'bg-indigo-500',
    glowColor: 'group-hover:shadow-indigo-500/20',
  },
  {
    icon: Bot,
    title: 'AI Processes & Embeds',
    description:
      'OpenAI generates high-dimensional embeddings that capture semantic meaning, stored in Qdrant vector database for lightning-fast similarity search.',
    iconGradient: 'from-purple-500 to-fuchsia-500',
    badgeColor: 'bg-purple-500',
    glowColor: 'group-hover:shadow-purple-500/20',
  },
  {
    icon: MessageSquare,
    title: 'Chat with Your Data',
    description:
      'Ask questions and receive accurate, context-aware answers powered by RAG — grounded in your data, not hallucinations.',
    iconGradient: 'from-amber-500 to-orange-500',
    badgeColor: 'bg-amber-500',
    glowColor: 'group-hover:shadow-amber-500/20',
  },
  {
    icon: Code2,
    title: 'Embed in Your Website',
    description:
      'The Chatbot can be easily configured and embedded in your website. Visitors get an instant AI chat widget powered by all your website content — no backend work needed.',
    iconGradient: 'from-teal-500 to-cyan-500',
    badgeColor: 'bg-teal-500',
    glowColor: 'group-hover:shadow-teal-500/20',
  },
];

const techStack = [
  { name: 'LangChain', color: 'text-indigo-600 dark:text-indigo-400' },
  { name: 'OpenAI', color: 'text-violet-600 dark:text-violet-400' },
  { name: 'Qdrant', color: 'text-purple-600 dark:text-purple-400' },
  { name: 'MongoDB', color: 'text-amber-600 dark:text-amber-400' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 lg:py-36 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(120,80,220,0.08),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(120,80,220,0.15),transparent)]" />

      {/* Subtle floating orbs */}
      <div className="absolute top-1/4 left-[15%] w-72 h-72 bg-indigo-400/8 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-[15%] w-72 h-72 bg-violet-400/8 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4">
            Simple 4-Step Process
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Transform your content into an intelligent AI assistant in minutes — no coding, no complexity.
          </p>
        </motion.div>

        {/* Steps grid with connector */}
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-[72px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px">
            <div className="w-full h-full bg-gradient-to-r from-indigo-300 via-violet-300 to-amber-300 dark:from-indigo-600 dark:via-violet-600 dark:to-amber-600 opacity-40" />
            {/* Animated pulse along the line */}
            <motion.div
              className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-transparent via-indigo-400 dark:via-indigo-400 to-transparent opacity-60"
              animate={{ left: ['0%', '75%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Desktop connector arrows between cards */}
          {[0, 1, 2].map((i) => (
            <div
              key={`arrow-${i}`}
              className="hidden lg:flex absolute top-[60px] items-center justify-center z-10"
              style={{
                left: `${25 * (i + 1)}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-violet-500 dark:text-violet-400" />
              </div>
            </div>
          ))}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="relative group"
              >
                <div
                  className={`
                    relative h-full rounded-2xl p-6 pt-8
                    bg-white/70 dark:bg-white/[0.04]
                    backdrop-blur-xl
                    border border-gray-200/80 dark:border-white/[0.06]
                    shadow-sm ${step.glowColor}
                    hover:shadow-xl hover:-translate-y-1.5
                    transition-all duration-500 ease-out
                  `}
                >
                  {/* Glassmorphic inner highlight */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 via-transparent to-transparent dark:from-white/[0.03] dark:via-transparent pointer-events-none" />

                  {/* Step number badge */}
                  <div
                    className={`
                      absolute -top-3.5 left-5
                      w-7 h-7 rounded-full ${step.badgeColor}
                      flex items-center justify-center
                      text-xs font-bold text-white
                      shadow-lg ring-4 ring-white dark:ring-gray-900
                    `}
                  >
                    {index + 1}
                  </div>

                  {/* Icon container */}
                  <div
                    className={`
                      relative w-14 h-14 rounded-xl mb-5
                      bg-gradient-to-br ${step.iconGradient}
                      flex items-center justify-center
                      shadow-lg
                      group-hover:scale-110 group-hover:rotate-[-2deg]
                      transition-transform duration-500 ease-out
                    `}
                  >
                    <step.icon className="w-7 h-7 text-white" strokeWidth={1.75} />
                  </div>

                  {/* Content */}
                  <h3 className="relative text-lg font-bold mb-2.5 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tech stack badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 flex justify-center"
        >
          <div
            className="
              inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2
              px-6 py-3 rounded-full
              bg-white/60 dark:bg-white/[0.04]
              backdrop-blur-lg
              border border-gray-200/80 dark:border-white/[0.06]
              shadow-sm
            "
          >
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500">
              Powered by
            </span>
            {techStack.map((tech, index) => (
              <span key={tech.name} className="flex items-center gap-x-3">
                {index > 0 && (
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                )}
                <span className={`text-sm font-semibold ${tech.color}`}>
                  {tech.name}
                </span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
