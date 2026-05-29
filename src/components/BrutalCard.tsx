import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BrutalCardProps {
  children: ReactNode;
  className?: string;
  color?: string;
  interactive?: boolean;
}

export function BrutalCard({ children, className, color = "bg-card", interactive = true }: BrutalCardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -4, x: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", mass: 0.5, stiffness: 400, damping: 12 }}
      className={cn(
        "border-4 border-ink rounded-3xl p-6 brutal-shadow",
        "transition-shadow",
        color,
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
