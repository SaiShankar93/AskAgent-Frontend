'use client';

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId, isLoaded } = useAuth();

    // If auth is loaded and there's no user, redirect to sign in
    if (isLoaded && !userId) {
        redirect("/");
    }

    // Show loading state while auth is loading
    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 dark:from-gray-950 dark:via-indigo-950/20 dark:to-violet-950/10 relative overflow-hidden">
                {/* Subtle ambient glow */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 via-violet-500/8 to-transparent rounded-full blur-[100px]" />
                <div className="relative z-10 flex flex-col items-center gap-5">
                    <div className="w-12 h-12 relative">
                        <div className="absolute inset-0 rounded-full border-[2.5px] border-transparent border-t-indigo-500 border-r-violet-500 animate-spin" />
                        <div className="absolute inset-1.5 rounded-full border-[2px] border-transparent border-b-amber-400/50 border-l-amber-400/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-xs font-medium tracking-widest uppercase">Authenticating</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
