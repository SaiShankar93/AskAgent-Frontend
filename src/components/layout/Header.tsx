"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Sparkles, Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: "#features", label: "Features" },
        { href: "#how-it-works", label: "How It Works" },
        { href: "/dashboard", label: "Dashboard" },
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg'
                    : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md'
            } border-b border-gray-200 dark:border-gray-800`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                            AskAgent
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 relative group"
                            >
                                {link.label}
                                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                            </a>
                        ))}
                    </nav>

                    {/* Right side buttons */}
                    <div className="flex items-center gap-3">
                        {/* Theme toggle */}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                            aria-label="Toggle theme"
                        >
                            {mounted && (
                                theme === "dark" ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )
                            )}
                        </button>

                        {/* Authentication buttons */}
                        <div className="hidden md:flex items-center gap-2">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                                        Get Started
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            
                            <SignedIn>
                                <UserButton 
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-10 h-10 rounded-xl shadow-lg hover:scale-110 transition-transform"
                                        }
                                    }}
                                />
                            </SignedIn>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            
                            <SignedOut>
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                                    <SignInButton mode="modal">
                                        <button className="w-full px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <button className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg">
                                            Get Started
                                        </button>
                                    </SignUpButton>
                                </div>
                            </SignedOut>
                            
                            <SignedIn>
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                                    <UserButton 
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: "w-10 h-10"
                                            }
                                        }}
                                    />
                                </div>
                            </SignedIn>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
