import { IconTarget, IconCheck, IconCalendar, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  todayCompletions: number;
  weeklyCompletions: number;
}

interface SectionCardsProps {
  stats: HabitStats;
}

export function SectionCards({ stats }: SectionCardsProps) {
  const completionRate = stats.activeHabits > 0
    ? Math.round((stats.todayCompletions / stats.activeHabits) * 100)
    : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Habits</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalHabits}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTarget />
              {stats.activeHabits} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Building better habits <IconTarget className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {stats.activeHabits} of {stats.totalHabits} habits are active
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Today's Progress</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.todayCompletions}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCheck />
              {completionRate}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.todayCompletions} completed today <IconCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {completionRate}% completion rate for today
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Weekly Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.weeklyCompletions}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCalendar />
              This week
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Consistent effort <IconCalendar className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Last 7 days completions
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Daily Average</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {Math.round(stats.weeklyCompletions / 7 * 10) / 10}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Per day
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady progress <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Average completions per day this week
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
