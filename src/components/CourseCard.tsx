import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  title: string;
  subtitle: string;
  progress: number;
  Icon: LucideIcon;
  bgColor: string;
  lessons: number;
}

export function CourseCard({ title, subtitle, progress, Icon, bgColor, lessons }: CourseCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4, x: -4, rotate: -0.5 }}
      transition={{ type: "spring", mass: 0.5, stiffness: 400, damping: 12 }}
      className={cn("p-5 border-4 border-ink rounded-3xl brutal-shadow transition-shadow", bgColor)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="p-3 bg-card border-4 border-ink rounded-2xl brutal-shadow-sm">
          <Icon className="w-7 h-7" strokeWidth={3} />
        </div>
        <span className="px-2 py-1 bg-card border-2 border-ink rounded-full text-[10px] font-black uppercase">
          {lessons} lessons
        </span>
      </div>

      <h3 className="mt-4 text-xl font-black leading-tight">{title}</h3>
      <p className="text-xs font-bold text-ink/70 uppercase tracking-wide">{subtitle}</p>

      {/* Liquid progress tube */}
      <div className="mt-5 relative w-full h-6 bg-card border-4 border-ink rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-coral to-banana relative"
        >
          {/* Gloss */}
          <div className="absolute top-1 left-2 right-2 h-1 bg-card/50 rounded-full" />
          {/* Bubbles */}
          <div className="absolute inset-0 flex items-center gap-2 pl-2">
            <span className="w-1.5 h-1.5 bg-card rounded-full animate-bubble" />
            <span className="w-1 h-1 bg-card rounded-full animate-bubble" style={{ animationDelay: "0.4s" }} />
            <span className="w-1.5 h-1.5 bg-card rounded-full animate-bubble" style={{ animationDelay: "0.8s" }} />
          </div>
        </motion.div>
      </div>
      <p className="mt-2 text-right text-xs font-black">{progress}% COMPLETE!</p>
    </motion.article>
  );
}
