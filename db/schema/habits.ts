import { pgTable, text, timestamp, uuid, integer, boolean, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const habits = pgTable("habits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  frequency: text("frequency").notNull().default("daily"), // daily, weekly, monthly
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' })
    .defaultNow()
    .notNull(),
}, (table) => ({
  userIdIdx: index("habits_user_id_idx").on(table.userId),
}));

export const habitCompletions = pgTable("habit_completions", {
  id: uuid("id").primaryKey().defaultRandom(),
  habitId: uuid("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at", { mode: 'date' })
    .defaultNow()
    .notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format for easy querying
  notes: text("notes"),
}, (table) => ({
  habitIdIdx: index("habit_completions_habit_id_idx").on(table.habitId),
  userIdIdx: index("habit_completions_user_id_idx").on(table.userId),
  uniqueHabitDate: index("habit_completions_unique_habit_date").on(table.habitId, table.date).unique(),
}));

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type NewHabitCompletion = typeof habitCompletions.$inferInsert;