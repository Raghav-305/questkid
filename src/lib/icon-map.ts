import {
  Award,
  BookOpen,
  Code,
  Crown,
  Flame,
  Heart,
  Medal,
  Moon,
  Palette,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  Code,
  Crown,
  Flame,
  Heart,
  Medal,
  Moon,
  Palette,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Zap,
};

export function resolveIcon(name: string | null | undefined, fallback: LucideIcon = BookOpen) {
  return name ? (icons[name] ?? fallback) : fallback;
}
