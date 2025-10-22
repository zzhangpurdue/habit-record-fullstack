"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { HabitCard } from "./habit-card"
import { HabitForm } from "./habit-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconSearch, IconFilter } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2 } from "lucide-react"

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

interface HabitTrackerProps {
  initialHabits: Habit[];
  initialTodayCompletions: TodayCompletion[];
}

export function HabitTracker({
  initialHabits,
  initialTodayCompletions
}: HabitTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [todayCompletions, setTodayCompletions] = useState<TodayCompletion[]>(initialTodayCompletions)
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>(initialHabits)
  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Get completed habit IDs for today
  const completedHabitIds = new Set(todayCompletions.map(c => c.habitId))

  // Filter habits based on search and filters
  useEffect(() => {
    let filtered = habits

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(habit =>
        habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Frequency filter
    if (frequencyFilter !== "all") {
      filtered = filtered.filter(habit => habit.frequency === frequencyFilter)
    }

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter(habit => habit.isActive)
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(habit => !habit.isActive)
    }

    setFilteredHabits(filtered)
  }, [habits, searchQuery, frequencyFilter, statusFilter])

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const [habitsResponse, completionsResponse] = await Promise.all([
        fetch("/api/habits"),
        fetch("/api/habits/today-completions")
      ])

      if (habitsResponse.ok && completionsResponse.ok) {
        const [newHabits, newCompletions] = await Promise.all([
          habitsResponse.json(),
          completionsResponse.json()
        ])
        setHabits(newHabits)
        setTodayCompletions(newCompletions)
      }
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHabitUpdated = () => {
    refreshData()
    setEditingHabit(null)
    setIsFormOpen(false)
  }

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setIsFormOpen(true)
  }

  const activeHabits = habits.filter(h => h.isActive)
  const completedToday = todayCompletions.length
  const completionRate = activeHabits.length > 0 ? Math.round((completedToday / activeHabits.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Habits</h1>
          <p className="text-muted-foreground">
            Track your daily habits and build consistency
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {completedToday}/{activeHabits} completed today
          </Badge>
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <IconPlus className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-md">
              <IconPlus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Total Habits</p>
              <p className="text-2xl font-bold">{habits.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-md">
              <IconPlus className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-2xl font-bold">{activeHabits.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-md">
              <IconPlus className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Completed Today</p>
              <p className="text-2xl font-bold">{completedToday}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-md">
              <IconPlus className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Completion Rate</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Habits Grid */}
      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompletedToday={completedHabitIds.has(habit.id)}
                onUpdated={handleHabitUpdated}
                onEdit={handleEditHabit}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchQuery || frequencyFilter !== "all" || statusFilter !== "all"
                  ? "No habits found matching your filters."
                  : "No habits created yet."}
              </p>
              {!searchQuery && frequencyFilter === "all" && statusFilter === "all" && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Create Your First Habit
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Habit Form Dialog */}
      <HabitForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        habit={editingHabit}
        onSuccess={handleHabitUpdated}
        variant="dialog"
      />
    </div>
  )
}