import { apiClient } from './client';
import {
  ApiResponse,
  Task,
  UserRoutine,
  SetCategoryRoutineRequest,
  TasksParams,
  TodayTasksParams,
} from './types';

// GET /routines/tasks
export async function getTasks(params?: TasksParams): Promise<ApiResponse<Task[]>> {
  return await apiClient.get<ApiResponse<Task[]>>('/routines/tasks', params);
}

// GET /routines
export async function getUserRoutine(): Promise<ApiResponse<UserRoutine[]>> {
  return await apiClient.get<ApiResponse<UserRoutine[]>>('/routines');
}

// GET /routines/today
export async function getTodaysTasks(params?: TodayTasksParams): Promise<ApiResponse<UserRoutine[]>> {
  return await apiClient.get<ApiResponse<UserRoutine[]>>('/routines/today', params);
}

// POST /routines/category
export async function setCategoryRoutine(request: SetCategoryRoutineRequest): Promise<ApiResponse<{
  category: string;
  routines: UserRoutine[];
}>> {
  return await apiClient.post<ApiResponse<{
    category: string;
    routines: UserRoutine[];
  }>>(
    '/routines/category',
    request
  );
}

// POST /routines/generate
export async function generateRoutine(): Promise<ApiResponse<{
  routines: UserRoutine[];
  message: string;
}>> {
  return await apiClient.post<ApiResponse<{
    routines: UserRoutine[];
    message: string;
  }>>(
    '/routines/generate'
  );
}