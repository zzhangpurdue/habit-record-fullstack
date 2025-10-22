"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createHabitSchema, updateHabitSchema } from "@/lib/validations/habits"

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HabitFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  habit?: Habit | null
  onSuccess?: () => void
  variant?: "dialog" | "sheet"
}

const habitFormSchema = createHabitSchema.or(updateHabitSchema)

type HabitFormValues = z.infer<typeof habitFormSchema>

export function HabitForm({
  open,
  onOpenChange,
  habit,
  onSuccess,
  variant = "dialog"
}: HabitFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const isEditing = !!habit

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      name: habit?.name || "",
      description: habit?.description || "",
      frequency: habit?.frequency || "daily",
    },
  })

  const onSubmit = async (values: HabitFormValues) => {
    setIsSubmitting(true)
    try {
      const url = isEditing ? `/api/habits/${habit.id}` : "/api/habits"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to save habit")
        return
      }

      toast.success(isEditing ? "Habit updated successfully!" : "Habit created successfully!")
      onOpenChange(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to save habit")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Read for 30 minutes"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Give your habit a clear, actionable name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional details about this habit..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide more context or details about your habit
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How often do you want to perform this habit?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Habit" : "Create Habit"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )

  const Content = (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Habit" : "Create New Habit"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Make changes to your habit below. Click save when you're done."
            : "Add a new habit to track. Fill in the details below."
          }
        </DialogDescription>
      </DialogHeader>
      <FormContent />
    </>
  )

  if (variant === "sheet") {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{isEditing ? "Edit Habit" : "Create New Habit"}</SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Make changes to your habit below. Click save when you're done."
                : "Add a new habit to track. Fill in the details below."
              }
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FormContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {Content}
      </DialogContent>
    </Dialog>
  )
}