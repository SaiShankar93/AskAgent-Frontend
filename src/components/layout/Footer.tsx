'use client';

import Link from 'next/link';
import { Sparkles, Github, Linkedin, Mail, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterLink {
    label: string;
    href: string;
}

interface FooterColumn {
    title: string;
    links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Dashboard', href: '/dashboard' },
        ],
    },
    {
        title: 'Technology',
        links: [
            { label: 'OpenAI', href: 'https://openai.com' },
            { label: 'Qdrant', href: 'https://qdrant.tech' },
        ],
    },
    {
        title: 'Connect',
        links: [
            { label: 'GitHub', href: 'https://github.com/SaiShankar93' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sai-shankar-punna/' },
            { label: 'Contact', href: 'mailto:saishankarpunna@gmail.com' },
        ],
    },
];

interface SocialLink {
    icon: typeof Github;
    href: string;
    label: string;
}

const socialLinks: SocialLink[] = [
    { icon: Github, href: 'https://github.com/SaiShankar93', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/sai-shankar-punna/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:saishankarpunna@gmail.com', label: 'Email' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden bg-gray-50/80 dark:bg-gray-950/80 border-t border-gray-200/60 dark:border-white/[0.06]">
            {/* Background ambient glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-indigo-500/[0.06] dark:bg-indigo-500/[0.04] blur-[100px]" />
                <div className="absolute -top-20 right-1/3 h-72 w-72 rounded-full bg-violet-500/[0.06] dark:bg-violet-500/[0.04] blur-[100px]" />
                <div className="absolute bottom-10 right-1/6 h-56 w-56 rounded-full bg-amber-500/[0.04] dark:bg-amber-500/[0.03] blur-[80px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main grid */}
                <div className="grid grid-cols-1 gap-12 pt-16 pb-12 md:grid-cols-12 md:gap-8">
                    {/* Brand column */}
                    <div className="md:col-span-4 lg:col-span-5">
                        <Link href="/" className="group inline-flex items-center gap-2.5">
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                                <Sparkles className="h-[18px] w-[18px] text-white" />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                                AskAgent
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            Transform websites and documents into intelligent AI assistants with
                            cutting-edge RAG technology.
                        </p>

                        {/* Social icons */}
                        <div className="mt-6 flex items-center gap-2.5">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target={social.href.startsWith('http') ? '_blank' : undefined}
                                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-200/60 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-violet-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-colors duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-[16px] w-[16px]" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8 lg:col-span-7">
                        {footerColumns.map((column) => (
                            <div key={column.title}>
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                    {column.title}
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                className="group inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                                            >
                                                <span className="relative">
                                                    {link.label}
                                                    <span className="absolute inset-x-0 -bottom-px h-px bg-indigo-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200/60 dark:border-white/[0.06] py-6 sm:flex-row">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        &copy; {currentYear} AskAgent. All rights reserved.
                    </p>
                    <p className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                        Made with
                        <Heart
                            className="mx-1.5 h-3.5 w-3.5 text-red-500 animate-pulse"
                            fill="currentColor"
                        />
                        by{' '}
                        <a
                            href="https://www.linkedin.com/in/sai-shankar-punna/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent hover:from-indigo-500 hover:to-violet-500 transition-all duration-200"
                        >
                            Sai Shankar Punna
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
