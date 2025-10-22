import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { habits, habitCompletions } from "@/db/schema/habits";
import { eq, and } from "drizzle-orm";

interface Params {
  params: Promise<{ habitId: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { habitId } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if habit exists and belongs to user
    const [habit] = await db
      .select()
      .from(habits)
      .where(
        and(
          eq(habits.id, habitId),
          eq(habits.userId, session.user.id)
        )
      );

    if (!habit) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const { completeHabitSchema } = await import("@/lib/validations/habits");
    const validatedData = completeHabitSchema.parse(body);

    // Default to today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const completionDate = validatedData.date || today;

    // Check if already completed for this date
    const [existingCompletion] = await db
      .select()
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, habitId),
          eq(habitCompletions.userId, session.user.id),
          eq(habitCompletions.date, completionDate)
        )
      );

    if (existingCompletion) {
      return NextResponse.json(
        { error: "Habit already completed for this date" },
        { status: 409 }
      );
    }

    // Create the completion
    const [completion] = await db
      .insert(habitCompletions)
      .values({
        habitId,
        userId: session.user.id,
        date: completionDate,
        notes: validatedData.notes,
        completedAt: new Date(),
      })
      .returning();

    return NextResponse.json(completion, { status: 201 });
  } catch (error) {
    console.error("Error completing habit:", error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Invalid input", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}