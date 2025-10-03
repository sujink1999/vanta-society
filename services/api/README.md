# Vanta Society API Client

A TypeScript API client for the Vanta Society backend with automatic JWT token management.

## Features

- ✅ **Automatic JWT Token Management** - Tokens are automatically stored and injected
- ✅ **TypeScript Support** - Full type safety with IntelliSense
- ✅ **Axios Interceptors** - Request/response logging and error handling
- ✅ **AsyncStorage Integration** - Secure token persistence
- ✅ **Comprehensive API Coverage** - All 13 backend endpoints

## Quick Start

```typescript
import api from '@/services/api';

// Sign in with Google
const authResponse = await api.auth.googleSignIn({ token: 'google_id_token' });

// Complete profile (Step 1)
await api.users.completeProfile({
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  countryCode: '+1'
});

// Get today's tasks
const todaysTasks = await api.routines.getTodaysTasks({
  timezone: 'America/New_York'
});

// Complete a task
await api.completions.completeTask({
  userRoutineId: 123,
  completionData: { notes: 'Great workout!' },
  timezone: 'America/New_York'
});
```

## Configuration

Update the base URL in `services/api/client.ts`:

```typescript
const BASE_URL = 'https://your-backend-url.com/api';
```

## Authentication

The client automatically handles JWT tokens:

```typescript
// Check if authenticated
const isAuthenticated = await api.auth.isAuthenticated();

// Sign out (clears token)
await api.auth.signOut();
```

## API Services

### Authentication (`api.auth`)
- `googleSignIn(request)` - Google OAuth sign-in
- `signOut()` - Clear stored token
- `isAuthenticated()` - Check auth status

### Users (`api.users`)
- `completeProfile(request)` - Step 1: Basic profile
- `submitInviteCode(request)` - Step 2: Invite codes
- `submitPhysicalStats(request)` - Step 3: Physical stats (optional)
- `submitWinterArcStart(request)` - Step 4: Start date
- `submitQuestionnaire(request)` - Submit questionnaire
- `getProfile()` - Get profile + routine
- `getScores()` - Get society scores

### Questionnaire (`api.questionnaire`)
- `getQuestions()` - Get questionnaire questions

### Routines (`api.routines`)
- `getTasks(params?)` - Get all tasks
- `getUserRoutine()` - Get user's routine
- `getTodaysTasks(params?)` - Get today's tasks
- `setCategoryRoutine(request)` - Set category routine

### Completions (`api.completions`)
- `completeTask(request)` - Mark task complete
- `getCompletionHistory(params?)` - Get completion history
- `getCompletionStats(params?)` - Get completion statistics

## Error Handling

```typescript
try {
  const response = await api.users.getProfile();
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  }
  console.error('API Error:', error.message);
}
```

## Development

The client includes request/response logging in development mode. Check the console for detailed API call information.