import { motion, type MotionProps } from "framer-motion";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BouncyButtonProps = {
  children: ReactNode;
  color?: string;
  size?: "sm" | "md" | "lg";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>;

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
};

export const BouncyButton = forwardRef<HTMLButtonElement, BouncyButtonProps>(
  ({ children, className, color = "bg-sunshine", size = "md", ...rest }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2, scale: 1.03 }}
        whileTap={{ y: 4, scale: 0.97 }}
        transition={{ type: "spring", mass: 0.5, stiffness: 400, damping: 12 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-black uppercase tracking-wide text-ink",
          "border-4 border-ink brutal-shadow-sm",
          "active:shadow-none active:translate-x-1 active:translate-y-1 transition-shadow",
          sizes[size],
          color,
          className,
        )}
        {...(rest as MotionProps & ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </motion.button>
    );
  },
);
BouncyButton.displayName = "BouncyButton";

export default BouncyButton;
