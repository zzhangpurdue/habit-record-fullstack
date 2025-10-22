import { db } from "@/db";
import { habits, habitCompletions } from "@/db/schema/habits";
import { eq, and, count, desc, gte, lte } from "drizzle-orm";

export async function getUserHabits(userId: string) {
  return await db
    .select({
      id: habits.id,
      name: habits.name,
      description: habits.description,
      frequency: habits.frequency,
      isActive: habits.isActive,
      createdAt: habits.createdAt,
      updatedAt: habits.updatedAt,
    })
    .from(habits)
    .where(eq(habits.userId, userId))
    .orderBy(desc(habits.createdAt));
}

export async function getHabitWithCompletions(habitId: string, userId: string) {
  const habit = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .limit(1);

  if (habit.length === 0) return null;

  const completions = await db
    .select({
      date: habitCompletions.date,
      completedAt: habitCompletions.completedAt,
      notes: habitCompletions.notes,
    })
    .from(habitCompletions)
    .where(
      and(
        eq(habitCompletions.habitId, habitId),
        eq(habitCompletions.userId, userId)
      )
    )
    .orderBy(desc(habitCompletions.completedAt));

  return {
    ...habit[0],
    completions,
  };
}

export async function getTodayCompletions(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  return await db
    .select({
      habitId: habitCompletions.habitId,
      habitName: habits.name,
      completedAt: habitCompletions.completedAt,
      notes: habitCompletions.notes,
    })
    .from(habitCompletions)
    .innerJoin(habits, eq(habitCompletions.habitId, habits.id))
    .where(
      and(
        eq(habitCompletions.userId, userId),
        eq(habitCompletions.date, today)
      )
    );
}

export async function getHabitStats(userId: string) {
  const totalHabits = await db
    .select({ count: count() })
    .from(habits)
    .where(eq(habits.userId, userId));

  const activeHabits = await db
    .select({ count: count() })
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.isActive, true)));

  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = await db
    .select({ count: count() })
    .from(habitCompletions)
    .where(
      and(
        eq(habitCompletions.userId, userId),
        eq(habitCompletions.date, today)
      )
    );

  // Get completions for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekStart = sevenDaysAgo.toISOString().split('T')[0];

  const weeklyCompletions = await db
    .select({ count: count() })
    .from(habitCompletions)
    .where(
      and(
        eq(habitCompletions.userId, userId),
        gte(habitCompletions.date, weekStart)
      )
    );

  return {
    totalHabits: totalHabits[0]?.count || 0,
    activeHabits: activeHabits[0]?.count || 0,
    todayCompletions: todayCompletions[0]?.count || 0,
    weeklyCompletions: weeklyCompletions[0]?.count || 0,
  };
}