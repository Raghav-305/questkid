import { createFileRoute } from "@tanstack/react-router";
import { Rocket, Shield, Trophy, Sparkles, BookOpen, Star } from "lucide-react";
import { HeroTile } from "@/components/HeroTile";
import { CourseCard } from "@/components/CourseCard";
import { QuestTracker } from "@/components/QuestTracker";
import { BrutalCard } from "@/components/BrutalCard";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — QuestKid" },
      { name: "description", content: "Your daily learning dashboard: streaks, courses and quests." },
    ],
  }),
  component: Dashboard,
});

const ACTIVE_COURSES = [
  { title: "Math Rocket", subtitle: "Numbers & Logic", progress: 72, Icon: Rocket, bgColor: "bg-sky", lessons: 18 },
  { title: "Word Wizards", subtitle: "Reading Power", progress: 45, Icon: BookOpen, bgColor: "bg-mint", lessons: 22 },
  { title: "Brave Shield", subtitle: "Kindness Quest", progress: 88, Icon: Shield, bgColor: "bg-peach", lessons: 12 },
  { title: "Star Coder", subtitle: "Tiny Programs", progress: 30, Icon: Star, bgColor: "bg-bubblegum", lessons: 16 },
];

function Dashboard() {
  return (
    <PageTransition>
      <HeroTile />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black">Keep going!</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Pick up where you left off
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {ACTIVE_COURSES.map((c) => (
                <CourseCard key={c.title} {...c} />
              ))}
            </div>
          </div>

          <BrutalCard color="bg-card">
            <QuestTracker />
          </BrutalCard>
        </div>

        <div className="space-y-6">
          <BrutalCard color="bg-banana">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 grid place-items-center bg-card border-4 border-ink rounded-2xl">
                <Trophy className="w-6 h-6" strokeWidth={3} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Total XP</p>
                <p className="text-3xl font-black">12,480</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-ink/70">
              You're 320 XP away from rank <span className="bg-card px-2 py-0.5 border-2 border-ink rounded-md">Explorer Pro</span>
            </p>
          </BrutalCard>

          <BrutalCard color="bg-mint">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 grid place-items-center bg-card border-4 border-ink rounded-2xl">
                <Sparkles className="w-6 h-6" strokeWidth={3} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest">Today's Goal</p>
            </div>
            <p className="mt-3 text-lg font-black leading-snug">Complete 2 more lessons to keep your streak alive! 🔥</p>
            <div className="mt-4 h-6 bg-card border-4 border-ink rounded-full overflow-hidden">
              <div className="h-full bg-coral w-2/3" />
            </div>
          </BrutalCard>

          <BrutalCard color="bg-bubblegum">
            <p className="text-xs font-black uppercase tracking-widest">Friend Activity</p>
            <ul className="mt-3 space-y-2 text-sm font-bold">
              <li>🦊 Maya just unlocked Pancake Math!</li>
              <li>🐼 Leo hit a 21-day streak!</li>
              <li>🦄 Aria earned the Brave badge!</li>
            </ul>
          </BrutalCard>
        </div>
      </div>
    </PageTransition>
  );
}
