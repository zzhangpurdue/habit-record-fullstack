import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { habitCompletions } from "@/db/schema/habits";
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');

    const completions = await db
      .select({
        id: habitCompletions.id,
        date: habitCompletions.date,
        completedAt: habitCompletions.completedAt,
        notes: habitCompletions.notes,
      })
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, habitId),
          eq(habitCompletions.userId, session.user.id)
        )
      )
      .orderBy(desc(habitCompletions.completedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(completions);
  } catch (error) {
    console.error("Error fetching habit completions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}