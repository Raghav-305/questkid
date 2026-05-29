import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, BookOpen, Trophy, Medal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dashboard", icon: Home, color: "bg-sky" },
  { to: "/courses", label: "My Courses", icon: BookOpen, color: "bg-mint" },
  { to: "/achievements", label: "Achievements", icon: Medal, color: "bg-peach" },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy, color: "bg-bubblegum" },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-6 top-6 bottom-6 w-64 flex-col gap-4 p-5 brutal-card bg-card z-40">
        <Link to="/" className="flex items-center gap-2 pb-4 border-b-4 border-ink border-dashed">
          <div className="w-12 h-12 grid place-items-center bg-banana border-4 border-ink rounded-2xl brutal-shadow-sm">
            <Sparkles className="w-6 h-6" strokeWidth={3} />
          </div>
          <div>
            <p className="text-xl font-black leading-none">QuestKid</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Learn & Play</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-3 mt-2">
          {items.map((it) => {
            const active = pathname === it.to;
            const Icon = it.icon;
            return (
              <Link key={it.to} to={it.to} className="block">
                <motion.div
                  whileHover={{ y: -2, x: -2 }}
                  whileTap={{ y: 3, x: 3 }}
                  transition={{ type: "spring", mass: 0.5, stiffness: 400, damping: 12 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl border-4 border-ink font-black",
                    "transition-shadow",
                    active
                      ? `${it.color} brutal-shadow-sm`
                      : "bg-card hover:brutal-shadow-sm",
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={3} />
                  <span className="text-sm uppercase tracking-wide">{it.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 bg-mint border-4 border-ink rounded-2xl brutal-shadow-sm">
          <p className="text-xs font-black uppercase">Level 7</p>
          <p className="text-2xl font-black">Explorer</p>
          <div className="mt-2 h-3 bg-card border-2 border-ink rounded-full overflow-hidden">
            <div className="h-full bg-coral" style={{ width: "62%" }} />
          </div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-around p-2 brutal-card bg-card">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 rounded-xl border-4",
                  active ? `${it.color} border-ink` : "border-transparent",
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={3} />
                <span className="text-[10px] font-black uppercase">{it.label.split(" ")[0]}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
