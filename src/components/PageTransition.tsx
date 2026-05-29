import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: "spring", mass: 0.6, stiffness: 200, damping: 20 }}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
}
