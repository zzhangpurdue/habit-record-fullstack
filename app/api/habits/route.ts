import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { habits, habitCompletions } from "@/db/schema/habits";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userHabits = await db
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
      .where(eq(habits.userId, session.user.id))
      .orderBy(desc(habits.createdAt));

    return NextResponse.json(userHabits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const { createHabitSchema } = await import("@/lib/validations/habits");
    const validatedData = createHabitSchema.parse(body);

    const [newHabit] = await db
      .insert(habits)
      .values({
        ...validatedData,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json(newHabit, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);

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