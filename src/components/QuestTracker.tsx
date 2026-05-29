import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Mock 7-week tracker, 0 = none, 1 = light, 2 = solid, 3 = streak
const DATA: number[][] = Array.from({ length: 7 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const seed = (w * 7 + d * 3) % 11;
    if (seed < 3) return 0;
    if (seed < 6) return 1;
    if (seed < 9) return 2;
    return 3;
  }),
);

const LEVELS = ["bg-card", "bg-mint/60", "bg-mint", "bg-coral"];

export function QuestTracker() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black">Weekly Quest Tracker</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Last 7 weeks of adventures
          </p>
        </div>
        <div className="flex items-center gap-1">
          {LEVELS.map((c, i) => (
            <span key={i} className={cn("w-4 h-4 border-2 border-ink rounded-md", c)} />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col justify-around text-[10px] font-black text-muted-foreground py-1">
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 flex-1">
          {DATA.map((week, wi) =>
            week.map((lvl, di) => (
              <motion.div
                key={`${wi}-${di}`}
                whileHover={{ scale: 1.4, rotate: 8 }}
                transition={{ type: "spring", mass: 0.4, stiffness: 500, damping: 10 }}
                className={cn(
                  "aspect-square grid place-items-center rounded-full border-2 border-ink cursor-pointer",
                  LEVELS[lvl],
                )}
              >
                {lvl >= 2 && <Check className="w-3 h-3" strokeWidth={4} />}
              </motion.div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
