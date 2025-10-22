flowchart TD
  A[User Access] --> B[Sign In or Sign Up]
  B --> C{Authenticated?}
  C -->|yes| D[Load Dashboard]
  C -->|no| B
  D --> E[Fetch Habits from DB]
  E --> F[Render Data Table]
  D --> G[Render Area Chart]
  F --> H{User Action}
  H -->|Create New Habit| I[Open Habit Form]
  I --> J[Submit Habit Data]
  J --> K[API createHabit]
  K --> E
  H -->|Log Completion| L[Trigger logCompletion]
  L --> M[API logCompletion]
  M --> E