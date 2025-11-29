'use client';

import Link from 'next/link';
import { Heart, Sparkles, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
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

    return (
        <footer className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand column */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                                AskAgent
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Transform websites and documents into intelligent AI assistants with RAG technology.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com/SaiShankar93"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all duration-300 hover:scale-110"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/sai-shankar-punna/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all duration-300 hover:scale-110"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:contact@saishankar.tech"
                                className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all duration-300 hover:scale-110"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links columns */}
                    {footerLinks.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                {column.title}
                            </h3>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            target={link.href.startsWith('http') ? '_blank' : undefined}
                                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                    {/* Bottom section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © {currentYear} AskAgent. All rights reserved.
                        </p>
                        <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            Made with{' '}
                            <Heart className="h-4 w-4 mx-1.5 text-red-500 animate-pulse" fill="currentColor" />
                            by{' '}
                            <a
                                href="https://www.linkedin.com/in/sai-shankar-punna/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1.5 font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:from-primary-500 hover:to-secondary-500 transition-all"
                            >
                                Sai Shankar Punna
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
