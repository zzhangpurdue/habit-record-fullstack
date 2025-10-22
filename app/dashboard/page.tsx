import { auth } from "@/lib/auth"
import { getUserHabits, getHabitStats, getTodayCompletions } from "@/lib/api/habits"
import { SectionCards } from "@/components/section-cards"
import { HabitsDashboard } from "@/components/habits-dashboard"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your habits.</p>
      </div>
    );
  }

  // Fetch data in parallel
  const [habits, stats, todayCompletions] = await Promise.all([
    getUserHabits(session.user.id),
    getHabitStats(session.user.id),
    getTodayCompletions(session.user.id),
  ]);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards stats={stats} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <div className="px-4 lg:px-6">
          <HabitsDashboard
          initialHabits={habits}
          initialTodayCompletions={todayCompletions}
        />
        </div>
      </div>
    </div>
  );
}