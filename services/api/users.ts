import { apiClient } from './client';
import {
  ApiResponse,
  User,
  UserScores,
  CompleteProfileRequest,
  InviteCodeRequest,
  PhysicalStatsRequest,
  WinterArcStartRequest,
  QuestionnaireResponse,
  UserRoutine,
} from './types';

// POST /users/complete-profile
export async function completeProfile(request: CompleteProfileRequest): Promise<ApiResponse<{ user: User }>> {
  return await apiClient.post<ApiResponse<{ user: User }>>(
    '/users/complete-profile',
    request
  );
}

// POST /users/invite-code
export async function submitInviteCode(request: InviteCodeRequest): Promise<ApiResponse<{ user: User }>> {
  return await apiClient.post<ApiResponse<{ user: User }>>(
    '/users/invite-code',
    request
  );
}

// POST /users/physical-stats
export async function submitPhysicalStats(request: PhysicalStatsRequest): Promise<ApiResponse<{
  physicalStats: Record<string, any>;
  skipped: boolean;
}>> {
  return await apiClient.post<ApiResponse<{
    physicalStats: Record<string, any>;
    skipped: boolean;
  }>>(
    '/users/physical-stats',
    request
  );
}

// POST /users/winter-arc-start
export async function submitWinterArcStart(request: WinterArcStartRequest): Promise<ApiResponse<{
  winterArcStartDate: string;
}>> {
  return await apiClient.post<ApiResponse<{
    winterArcStartDate: string;
  }>>(
    '/users/winter-arc-start',
    request
  );
}

// PUT /users/questionnaire
export async function submitQuestionnaire(request: QuestionnaireResponse): Promise<ApiResponse<{
  scores: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
    society: number;
  };
}>> {
  return await apiClient.put<ApiResponse<{
    scores: {
      discipline: number;
      mindset: number;
      strength: number;
      momentum: number;
      confidence: number;
      society: number;
    };
  }>>(
    '/users/questionnaire',
    request
  );
}

// GET /users/profile
export async function getProfile(): Promise<ApiResponse<{
  user: User;
  routine: UserRoutine[];
  hasCompletedQuestionnaire: boolean;
}>> {
  return await apiClient.get<ApiResponse<{
    user: User;
    routine: UserRoutine[];
    hasCompletedQuestionnaire: boolean;
  }>>('/users/profile');
}

// GET /users/scores
export async function getScores(): Promise<ApiResponse<UserScores>> {
  return await apiClient.get<ApiResponse<UserScores>>('/users/scores');
}

// POST /users/complete-onboarding
export async function completeOnboarding(): Promise<ApiResponse<{
  onboardingDone: boolean;
  user: User;
}>> {
  return await apiClient.post<ApiResponse<{
    onboardingDone: boolean;
    user: User;
  }>>('/users/complete-onboarding');
}