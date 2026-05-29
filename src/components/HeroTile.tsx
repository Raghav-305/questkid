import { StreakFlame } from "./StreakFlame";
import { BouncyButton } from "./ui/BouncyButton";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export function HeroTile() {
  return (
    <section className="relative overflow-hidden border-4 border-ink rounded-3xl p-8 bg-sky brutal-shadow">
      {/* Floating decoration */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 right-8 w-16 h-16 bg-banana border-4 border-ink rounded-2xl grid place-items-center brutal-shadow-sm"
      >
        <Rocket className="w-8 h-8" strokeWidth={3} />
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-8 -right-8 w-32 h-32 bg-bubblegum border-4 border-ink rounded-full opacity-70"
      />

      <div className="relative max-w-xl">
        <span className="inline-block px-3 py-1 bg-card border-4 border-ink rounded-full text-xs font-black uppercase tracking-widest">
          Today's Quest
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-black leading-tight">
          Woohoo! Welcome back,<br />
          <span className="bg-banana px-2 border-4 border-ink rounded-xl inline-block mt-2">Adventurer!</span>
        </h1>
        <p className="mt-4 text-base font-bold text-ink/80 max-w-md">
          You've got 3 lessons waiting and a brand-new badge to unlock. Ready to roll?
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <BouncyButton color="bg-coral">Continue Learning →</BouncyButton>
          <BouncyButton color="bg-card">View Map</BouncyButton>
        </div>

        <div className="mt-8">
          <StreakFlame days={12} />
        </div>
      </div>
    </section>
  );
}
