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
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}
