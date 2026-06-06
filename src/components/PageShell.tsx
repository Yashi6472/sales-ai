import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import villa from "@/assets/luxury-villa-hero.jpg";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.10]"
        style={{
          backgroundImage: `url(${villa})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/85 to-background" />
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
