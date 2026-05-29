import { motion } from "framer-motion";
import { Lock, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  name: string;
  description: string;
  Icon: LucideIcon;
  color: string;
  unlocked: boolean;
}

export function BadgeCard({ name, description, Icon, color, unlocked }: BadgeProps) {
  return (
    <motion.div
      whileHover={{ y: -4, rotate: unlocked ? [-2, 2, -2, 0] : 0 }}
      transition={{ type: "spring", mass: 0.5, stiffness: 400, damping: 12 }}
      className={cn(
        "relative p-5 text-center border-4 border-ink rounded-3xl brutal-shadow",
        unlocked ? color : "bg-card",
      )}
    >
      <div
        className={cn(
          "mx-auto w-20 h-20 grid place-items-center border-4 border-ink rounded-full brutal-shadow-sm",
          unlocked ? "bg-card" : "bg-muted",
        )}
      >
        {unlocked ? (
          <Icon className="w-9 h-9" strokeWidth={3} />
        ) : (
          <Lock className="w-8 h-8 text-muted-foreground" strokeWidth={3} />
        )}
      </div>
      <h3 className={cn("mt-4 text-base font-black", !unlocked && "text-muted-foreground")}>{name}</h3>
      <p className="text-xs font-bold text-ink/70 mt-1">{description}</p>
      {!unlocked && (
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-card border-2 border-ink rounded-full text-[9px] font-black uppercase">
          Locked
        </span>
      )}
    </motion.div>
  );
}
