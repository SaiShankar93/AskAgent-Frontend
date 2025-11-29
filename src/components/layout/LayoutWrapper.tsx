'use client';

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Header />}
      <main className={isDashboard ? "" : "flex-grow pt-16"}>{children}</main>
    </>
  );
}
