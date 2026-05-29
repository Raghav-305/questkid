import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export function StreakFlame({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-4">
      <motion.div
        animate={{ rotate: [-6, 6, -6], y: [0, -3, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20 grid place-items-center bg-coral border-4 border-ink rounded-full brutal-shadow-sm"
      >
        <Flame className="w-10 h-10 text-card" strokeWidth={3} fill="currentColor" />
        <span className="absolute -top-2 -right-2 bg-banana border-4 border-ink rounded-full px-2 py-0.5 text-xs font-black">
          {days}
        </span>
      </motion.div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Daily Streak</p>
        <p className="text-3xl font-black">{days} days!</p>
        <p className="text-sm font-bold text-muted-foreground">Keep the fire burning 🔥</p>
      </div>
    </div>
  );
}
