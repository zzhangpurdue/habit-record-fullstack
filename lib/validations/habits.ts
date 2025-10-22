import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),
});

export const updateHabitSchema = createHabitSchema.partial();

export const completeHabitSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type CompleteHabitInput = z.infer<typeof completeHabitSchema>;