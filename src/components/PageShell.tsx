import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import livingRoom from "@/assets/living-room-bg.jpg";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage: `url(${livingRoom})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
