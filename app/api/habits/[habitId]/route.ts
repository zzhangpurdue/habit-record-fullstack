import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { habits, habitCompletions } from "@/db/schema/habits";
import { eq, and, desc } from "drizzle-orm";

interface Params {
  params: Promise<{ habitId: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
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

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error fetching habit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
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

    const body = await request.json();

    const { updateHabitSchema } = await import("@/lib/validations/habits");
    const validatedData = updateHabitSchema.parse(body);

    const [updatedHabit] = await db
      .update(habits)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(habits.id, habitId),
          eq(habits.userId, session.user.id)
        )
      )
      .returning();

    if (!updatedHabit) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedHabit);
  } catch (error) {
    console.error("Error updating habit:", error);

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

export async function DELETE(request: NextRequest, { params }: Params) {
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

    const [deletedHabit] = await db
      .delete(habits)
      .where(
        and(
          eq(habits.id, habitId),
          eq(habits.userId, session.user.id)
        )
      )
      .returning();

    if (!deletedHabit) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}