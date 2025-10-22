import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { habitCompletions } from "@/db/schema/habits";
import { eq, and } from "drizzle-orm";

interface Params {
  params: Promise<{ completionId: string }>;
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { completionId } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [deletedCompletion] = await db
      .delete(habitCompletions)
      .where(
        and(
          eq(habitCompletions.id, completionId),
          eq(habitCompletions.userId, session.user.id)
        )
      )
      .returning();

    if (!deletedCompletion) {
      return NextResponse.json(
        { error: "Completion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Completion deleted successfully" });
  } catch (error) {
    console.error("Error deleting completion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}