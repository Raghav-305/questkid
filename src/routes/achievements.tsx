import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCard } from "@/components/BadgeCard";
import { PageTransition } from "@/components/PageTransition";
import { resolveIcon } from "@/lib/icon-map";
import { getPublicBadges } from "@/lib/public-supabase.queries";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — QuestKid" },
      {
        name: "description",
        content: "Collect badges as you complete quests and grow your skills.",
      },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const {
    data: badges = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["badges"],
    queryFn: getPublicBadges,
  });

  const unlocked = badges.length;

  return (
    <PageTransition>
      <header className="brutal-card bg-peach p-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest">Trophy Case</p>
          <h1 className="mt-1 text-4xl font-black">Achievements</h1>
          <p className="mt-2 text-sm font-bold text-ink/70">
            Tap a shiny badge to relive the moment.
          </p>
        </div>
        <div className="px-5 py-3 bg-card border-4 border-ink rounded-2xl brutal-shadow-sm">
          <p className="text-xs font-black uppercase">Unlocked</p>
          <p className="text-3xl font-black">
            {unlocked}/{badges.length}
          </p>
        </div>
      </header>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-paper border-4 border-ink rounded-3xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-6 bg-coral/20 border-4 border-coral rounded-2xl">
          <h3 className="font-bold text-red-600">Error Loading Badges</h3>
          <p className="text-sm mt-2">{String(error)}</p>
        </div>
      )}

      {!isLoading && !error && badges.length === 0 && (
        <div className="p-6 bg-banana/20 border-4 border-banana rounded-2xl">
          <h3 className="font-bold">No badges found</h3>
          <p className="text-sm mt-2">Run the Supabase seed data for the badges table.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.id}
            name={badge.name}
            description={badge.description ?? ""}
            Icon={resolveIcon(badge.icon_name)}
            color={badge.color}
            unlocked
          />
        ))}
      </div>
    </PageTransition>
  );
}
