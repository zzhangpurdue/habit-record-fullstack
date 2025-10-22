"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  IconCheck,
  IconCircleCheck,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconTarget,
} from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { MoreHorizontal } from "lucide-react"

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HabitCardProps {
  habit: Habit;
  isCompletedToday?: boolean;
  onUpdated?: () => void;
  onEdit?: (habit: Habit) => void;
}

export function HabitCard({
  habit,
  isCompletedToday = false,
  onUpdated,
  onEdit
}: HabitCardProps) {
  const [isCompleting, setIsCompleting] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleCompleteHabit = async () => {
    if (isCompletedToday) {
      toast.info("Already completed today!")
      return
    }

    setIsCompleting(true)
    try {
      const response = await fetch(`/api/habits/${habit.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const error = await response.json()
        if (response.status === 409) {
          toast.error("Already completed today!")
        } else {
          toast.error(error.error || "Failed to complete habit")
        }
        return
      }

      toast.success("Habit completed! 🎉")
      onUpdated?.()
    } catch (error) {
      toast.error("Failed to complete habit")
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDeleteHabit = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to delete habit")
        return
      }

      toast.success("Habit deleted successfully")
      onUpdated?.()
    } catch (error) {
      toast.error("Failed to delete habit")
    } finally {
      setIsDeleting(false)
    }
  }

  const frequencyColors = {
    daily: "default",
    weekly: "secondary",
    monthly: "outline"
  } as const

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isCompletedToday ? 'border-green-200 bg-green-50/50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{habit.name}</CardTitle>
            {habit.description && (
              <CardDescription className="text-sm">
                {habit.description}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(habit)}>
                <IconEdit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <IconTrash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the habit "{habit.name}" and all its completion history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteHabit}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-2 mb-3">
          <IconTarget className="h-4 w-4 text-muted-foreground" />
          <Badge variant={frequencyColors[habit.frequency]}>
            {habit.frequency}
          </Badge>
          <Badge variant={habit.isActive ? "default" : "secondary"}>
            {habit.isActive ? "Active" : "Inactive"}
          </Badge>
          {isCompletedToday && (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              <IconCheck className="mr-1 h-3 w-3" />
              Completed Today
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconCalendar className="h-4 w-4" />
          <span>Created {format(new Date(habit.createdAt), "MMM d, yyyy")}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleCompleteHabit}
          disabled={isCompleting || isCompletedToday}
          className="w-full"
          variant={isCompletedToday ? "outline" : "default"}
        >
          {isCompleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing...
            </>
          ) : isCompletedToday ? (
            <>
              <IconCheck className="mr-2 h-4 w-4" />
              Already Completed
            </>
          ) : (
            <>
              <IconCircleCheck className="mr-2 h-4 w-4" />
              Complete Today
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}