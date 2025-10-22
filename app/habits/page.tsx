import { auth } from "@/lib/auth"
import { getUserHabits, getTodayCompletions } from "@/lib/api/habits"
import { HabitTracker } from "@/components/habit-tracker"
import { redirect } from "next/navigation"

export default async function HabitsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch data in parallel
  const [habits, todayCompletions] = await Promise.all([
    getUserHabits(session.user.id),
    getTodayCompletions(session.user.id),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <HabitTracker
        initialHabits={habits}
        initialTodayCompletions={todayCompletions}
      />
    </div>
  );
}