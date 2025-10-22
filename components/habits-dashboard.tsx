"use client"

import { HabitTracker } from "./habit-tracker"
import { useState, useEffect } from "react"

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodayCompletion {
  habitId: string;
  habitName: string;
  completedAt: string;
  notes?: string;
}

interface HabitsDashboardProps {
  initialHabits: Habit[];
  initialTodayCompletions: TodayCompletion[];
}

export function HabitsDashboard({
  initialHabits,
  initialTodayCompletions
}: HabitsDashboardProps) {
  return (
    <HabitTracker
      initialHabits={initialHabits}
      initialTodayCompletions={initialTodayCompletions}
    />
  );
}