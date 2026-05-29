import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { BadgePodium } from "@/components/BadgePodium";
import { PageTransition } from "@/components/PageTransition";
import { getLeaderboardServerFn } from "@/lib/supabase.functions";
import { cn } from "@/lib/utils";

type LeaderboardPlayer = {
  rank: number;
  id: string;
  name: string;
  xp: number;
  avatar: string;
};

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard - QuestKid" },
      {
        name: "description",
        content: "See how you stack up against your friends this week.",
      },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const getLeaderboard = useServerFn(getLeaderboardServerFn);
  const {
    data: profiles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  const players: LeaderboardPlayer[] = profiles.map((profile, index) => ({
    rank: index + 1,
    id: profile.id,
    name: profile.display_name ?? `User ${profile.id.slice(0, 8)}`,
    xp: profile.xp,
    avatar: profile.avatar_emoji,
  }));

  const topThree = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <PageTransition>
      <header className="brutal-card bg-bubblegum p-8">
        <p className="text-xs font-black uppercase tracking-widest">This Week</p>
        <h1 className="mt-1 text-4xl font-black">Leaderboard</h1>
        <p className="mt-2 text-sm font-bold text-ink/70">Resets every Monday. Keep practicing!</p>
      </header>

      {isLoading && <div className="h-72 bg-paper border-4 border-ink rounded-3xl animate-pulse" />}

      {error && (
        <div className="p-6 bg-coral/20 border-4 border-coral rounded-2xl">
          <h3 className="font-bold text-red-600">Error Loading Profiles</h3>
          <p className="text-sm mt-2">{String(error)}</p>
        </div>
      )}

      {!isLoading && !error && players.length === 0 && (
        <div className="p-6 bg-banana/20 border-4 border-banana rounded-2xl">
          <h3 className="font-bold">No profiles found</h3>
          <p className="text-sm mt-2">Add profiles in Supabase to populate the leaderboard.</p>
        </div>
      )}

      {topThree.length === 3 && (
        <div className="brutal-card bg-banana p-6 md:p-8">
          <BadgePodium players={[topThree[0], topThree[1], topThree[2]]} />
        </div>
      )}

      {players.length > 0 && topThree.length < 3 && (
        <div className="brutal-card bg-card p-6">
          <h2 className="text-xl font-black mb-4">Top Learners</h2>
          <LeaderboardRows players={players} />
        </div>
      )}

      {rest.length > 0 && (
        <div className="brutal-card bg-card p-6">
          <h2 className="text-xl font-black mb-4">The Rest of the Pack</h2>
          <LeaderboardRows players={rest} />
        </div>
      )}
    </PageTransition>
  );
}

function LeaderboardRows({ players }: { players: LeaderboardPlayer[] }) {
  return (
    <ul className="space-y-3">
      {players.map((p, i) => (
        <motion.li
          key={p.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
          className={cn(
            "flex items-center gap-4 p-3 border-4 border-ink rounded-2xl",
            p.rank === 1 ? "bg-mint brutal-shadow-sm" : "bg-paper",
          )}
        >
          <span className="w-10 h-10 grid place-items-center bg-card border-4 border-ink rounded-full font-black text-sm">
            {p.rank}
          </span>
          <span className="text-2xl">{p.avatar}</span>
          <span className="flex-1 font-black">{p.name}</span>
          <span className="font-black text-sm">{p.xp.toLocaleString()} XP</span>
        </motion.li>
      ))}
    </ul>
  );
}
