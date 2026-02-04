'use client';

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
        <footer className="relative bg-white dark:bg-gray-950 border-t border-gray-200/70 dark:border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.05),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.08),_transparent_55%)]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-sm">
                                <Sparkles className="w-4 h-4 text-white dark:text-gray-900" />
                            </div>
                            <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                AskAgent
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Transform websites and documents into intelligent AI assistants with a refined, human-first experience.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com/SaiShankar93"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/sai-shankar-punna/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:contact@saishankar.tech"
                                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {footerLinks.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                {column.title}
                            </h3>
                            <ul className="space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            target={link.href.startsWith('http') ? '_blank' : undefined}
                                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200/70 dark:border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © {currentYear} AskAgent. All rights reserved.
                        </p>
                        <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            Made with{' '}
                            <Heart className="h-4 w-4 mx-1.5 text-rose-500" fill="currentColor" />
                            by{' '}
                            <a
                                href="https://www.linkedin.com/in/sai-shankar-punna/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1.5 font-semibold text-gray-900 dark:text-white hover:opacity-70 transition-all"
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
