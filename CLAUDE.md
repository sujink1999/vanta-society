# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run ios          # Start iOS simulator
npm run android      # Start Android emulator
npm run web          # Start web development

# Code quality
npm run lint         # Run ESLint

# Reset project (if needed)
npm run reset-project
```

## Project Architecture

**Framework**: Expo 54 with React Native 0.81.4 using Expo Router for file-based routing

**Key Configuration**:

- New Architecture enabled (`newArchEnabled: true`)
- TypeScript with typed routes (`typedRoutes: true`)
- React Compiler experimental feature enabled
- Bundle identifier: `com.vanta.society`

### Routing Structure

Uses Expo Router with file-based routing:

- `app/_layout.tsx` - Root layout with font loading and navigation setup
- `app/(auth)/` - Authentication flow screens (login, onboarding)
- `app/(tabs)/` - Tab-based navigation group (Winter Arc, Store, Community, Tools)
- `app/(tabs)/_layout.tsx` - Tab navigator configuration
- `app/(tabs)/winterarc/` - Winter Arc tab with nested stack navigation
  - `index.tsx` - Winter Arc home screen
  - `profile.tsx` - Profile screen (opens on top while keeping tab selected)
  - `_layout.tsx` - Stack layout for nested navigation

**Important Routing Notes**:

- Winter Arc tab uses nested stack navigation - profile opens on top while tab stays selected
- When navigating to tabs, always use `/(tabs)/winterarc` not `/(tabs)` (which is invalid)
- Screen components live in `/screens/tabs/` and are imported by route files
- Tab route files (e.g., `app/(tabs)/store.tsx`) should only import and re-export the screen component from `/screens/tabs/`
- Tab-level profile route (`/(tabs)/profile`) is hidden with `href: null` - use `/(tabs)/winterarc/profile` instead

### Theme System

Located in `constants/theme.ts` - Direct import approach (no context/hooks):

**Colors**:

- Primary: `#FF5C2A` (Vanta orange)
- Background: `#000000` (black)
- Text Primary: `#FFFFFF` (white)
- Text Secondary: `#979797` (gray)

**Fonts**:

- **Primary**: TussiLago (custom fonts in `/assets/fonts/`)
  - Available weights: ExtraLight, Light, Regular, Bold, Heavy
- **Secondary**: Montserrat (Google Fonts via `@expo-google-fonts/montserrat`)
  - Available weights: Light, Regular, Medium, SemiBold, Bold, ExtraBold

**Typography**: Predefined text styles combining fonts and sizing

### Styling with twrnc

Uses `twrnc` (Tailwind React Native Classnames) configured in `constants/tw.ts`:

**Custom Tailwind Classes**:

- Colors: `bg-primary`, `bg-black`, `bg-white`, `text-textPrimary`, `text-textSecondary`
- Fonts: `font-tussi-extra-light`, `font-tussi-light`, `font-tussi`, `font-tussi-bold`, `font-tussi-heavy`, `font-mont-light`, `font-mont`, `font-mont-medium`, `font-mont-semibold`, `font-mont-bold`, `font-mont-extrabold`

**Usage Patterns**:

```tsx
import tw from '@/constants/tw';
import { Typography } from '@/constants/theme';

// Pure twrnc
<View style={tw`flex-1 justify-center items-center bg-vanta-black p-4`} />

// Combining twrnc with Typography
<Text style={[tw`text-text-primary mb-4`, Typography.Title]}>
  Title Text
</Text>

// Direct theme usage (when needed)
backgroundColor: Colors.primary,
fontFamily: Fonts.TussiLago.Bold,
```

### Font Loading

Font loading handled in `constants/useFonts.ts` using `expo-font`:

- Custom TussiLago fonts loaded from local assets
- Montserrat loaded from Google Fonts package
- App shows loading screen until fonts are ready

### Asset Structure

- Icons and images: `/assets/images/` (includes app icons, splash screens)
- Custom fonts: `/assets/fonts/` (TussiLago family)
- All required platform icons are preserved for app configuration

### API Integration

Located in `services/api/` - Complete TypeScript API client for Vanta Society backend:

**Structure:**

- `client.ts` - Axios instance with JWT interceptors and token management
- `types.ts` - Complete TypeScript interfaces for all API data
- `auth.ts` - Authentication service (Google OAuth, JWT tokens)
- `users.ts` - User management (profile, questionnaire, scores)
- `questionnaire.ts` - Questionnaire questions service
- `routines.ts` - Tasks and routine management service
- `completions.ts` - Task completion tracking service
- `index.ts` - Main API export with all services

**Features:**

- Automatic JWT token injection via axios interceptors
- Token persistence using AsyncStorage
- Auto-logout on 401/403 responses
- Request/response logging in development
- Full TypeScript coverage for all 13 backend endpoints
- Standardized error handling

**Usage Pattern:**

```tsx
import {
  googleSignIn,
  getProfile,
  getTodaysTasks,
  completeTask,
} from "@/services/api";

// Authentication (token stored automatically)
await googleSignIn({ token: "google_id_token" });

// Get user data (JWT auto-injected)
const profile = await getProfile();
const todaysTasks = await getTodaysTasks();

// Complete tasks
await completeTask({
  userRoutineId: 123,
  completionData: { notes: "Done!" },
});
```

**Available Functions:**

- **Auth**: `googleSignIn()`, `signOut()`
- **Users**: `completeProfile()`, `submitInviteCode()`, `submitPhysicalStats()`, `submitWinterArcStart()`, `submitQuestionnaire()`, `getProfile()`, `getScores()`
- **Questionnaire**: `getQuestions()`
- **Routines**: `getTasks()`, `getUserRoutine()`, `getTodaysTasks()`, `setCategoryRoutine()`
- **Completions**: `completeTask()`, `getCompletionHistory()`, `getCompletionStats()`

### Global State Management

Uses React Context for global state via `contexts/GlobalContext.tsx`:

**GlobalContext provides:**

- `user` - Current user data (from `useUser` hook)
- `routine` - User's routine tasks
- `hasCompletedQuestionnaire` - Boolean flag
- `isAuthenticating` - Loading state
- `refetchUser()` - Refetch user data with loading state
- `refetchUserSilently()` - Refetch without loading state
- `winterArcStats` - Computed statistics from `useWinterArcStats` hook
  - Current/old/potential scores for all vitals (discipline, mindset, strength, momentum, confidence, society)
  - `streak` - Current streak count
  - `streakCadenceLast7Days` - Array of last 7 days streak data
  - `tasksCompletedPerDay` - Task completion map by date

**Usage:**

```tsx
import { useGlobalContext } from "@/contexts/GlobalContext";

const { user, winterArcStats, refetchUser } = useGlobalContext();
```

**Custom Hooks:**

- `useUser()` - Manages user authentication and profile data
- `useWinterArcStats()` - Computes Winter Arc statistics from user/routine data
- `useTasks()` - Fetches and filters tasks by date and status (todos/done/skipped)
- `useTaskActions()` - Provides task completion and skip actions

### Backend Repository

**Location**: `/Users/sujink/Development/Vanta/society-backend`

This is the Node.js backend repository for the Vanta Society app. When working on API integration or understanding data models, reference this repository to:

- Understand database schema and data structures
- Review API endpoint implementations
- Check request/response formats
- Verify authentication and business logic

The frontend API client in `services/api/` is built to match the backend's exact specifications.

## Winter Arc Flow Implementation

**Simplified Component Architecture**: Winter Arc steps follow a clean, functional approach:

**Step Component Pattern**:

```tsx
interface StepProps {
  onNext: () => void;
}

export function StepComponent({ onNext }: StepProps) {
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    try {
      // Make API call directly here
      const response = await submitData({ data });
      if (response.success) {
        onNext();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 px-6 py-8`}>
      <ScrollView style={tw`flex-1`}>{/* Content */}</ScrollView>
      <Button title="Continue" onPress={handleNext} loading={loading} />
    </View>
  );
}
```

**Flow Controller Pattern**:

```tsx
export default function Flow() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(currentStep + 1);

  const getComponent = () => {
    if (currentStep === 0) return <StepOne onNext={nextStep} />;
    if (currentStep === 1) return <StepTwo onNext={nextStep} />;
    // ... etc
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>{getComponent()}</SafeAreaView>
  );
}
```

**Key Principles**:

- No complex state management across steps
- Each step handles its own data and API calls
- Simple step-by-step navigation with direct index mapping
- Built-in loading states using Button component
- Direct API calls within step components (no centralized state)

## Date Handling

**Use Moment.js** for all date operations:

```tsx
import moment from "moment";

// Replace Date() with moment()
const now = moment();
const futureDate = moment().add(7, "days");
const difference = startDate.diff(now);
const duration = moment.duration(difference);

// Formatting
const formatted = moment().format("YYYY-MM-DD");
const readable = moment().format("dddd, MMM D");
```

### Development Notes

- No dark mode support (single theme only)
- Clean, minimal boilerplate removed - only essential structure remains
- Uses direct theme imports rather than context providers for simplicity
- ESLint configured with expo-config for code formatting
- Backend URL configured in `services/api/client.ts` (update for production)
- **Step Components**: Use simple onNext callback pattern, no complex prop passing
- **Date Operations**: Always use moment.js instead of native Date objects
