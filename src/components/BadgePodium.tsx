import { motion } from "framer-motion";
import { Crown, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  name: string;
  xp: number;
  avatar: string;
}

interface PodiumProps {
  players: [Player, Player, Player];
}

const PODIUM = [
  { rank: 2, height: "h-32", color: "bg-mint", Icon: Medal, label: "2nd" },
  { rank: 1, height: "h-44", color: "bg-banana", Icon: Crown, label: "1st" },
  { rank: 3, height: "h-24", color: "bg-peach", Icon: Award, label: "3rd" },
];

export function BadgePodium({ players }: PodiumProps) {
  // Order: 2nd, 1st, 3rd
  const ordered = [players[1], players[0], players[2]];

  return (
    <div className="flex items-end justify-center gap-4 md:gap-6 py-6">
      {PODIUM.map((spot, i) => {
        const p = ordered[i];
        return (
          <motion.div
            key={spot.rank}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", mass: 0.6, stiffness: 200, damping: 14, delay: i * 0.15 }}
            className="flex flex-col items-center flex-1 max-w-[180px]"
          >
            <motion.div
              animate={spot.rank === 1 ? { y: [0, -6, 0], rotate: [-2, 2, -2] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-2"
            >
              {p.avatar}
            </motion.div>
            <p className="font-black text-sm md:text-base text-center">{p.name}</p>
            <p className="text-xs font-bold text-muted-foreground">{p.xp.toLocaleString()} XP</p>

            <div
              className={cn(
                "mt-3 w-full grid place-items-center border-4 border-ink rounded-t-2xl brutal-shadow",
                spot.height,
                spot.color,
              )}
            >
              <div className="text-center">
                <spot.Icon className="w-7 h-7 mx-auto" strokeWidth={3} />
                <p className="text-2xl font-black mt-1">{spot.label}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
