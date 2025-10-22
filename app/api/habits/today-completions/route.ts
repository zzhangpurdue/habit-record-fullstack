import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTodayCompletions } from "@/lib/api/habits";

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

    const completions = await getTodayCompletions(session.user.id);

    return NextResponse.json(completions);
  } catch (error) {
    console.error("Error fetching today's completions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}