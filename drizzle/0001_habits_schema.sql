CREATE TABLE "habits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"frequency" text NOT NULL DEFAULT 'daily',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habit_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habit_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"date" text NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE INDEX "habits_user_id_idx" ON "habits" ("user_id");--> statement-breakpoint
CREATE INDEX "habit_completions_habit_id_idx" ON "habit_completions" ("habit_id");--> statement-breakpoint
CREATE INDEX "habit_completions_user_id_idx" ON "habit_completions" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "habit_completions_unique_habit_date" ON "habit_completions" ("habit_id", "date");--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_completions" ADD CONSTRAINT "habit_completions_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habit_completions" ADD CONSTRAINT "habit_completions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;