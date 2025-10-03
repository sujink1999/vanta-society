import { apiClient } from "./client";
import {
  ApiResponse,
  CompleteTaskRequest,
  CompletionHistoryParams,
  CompletionStatsParams,
  CompletionStatsResponse,
  TaskCompletion,
  TaskCompletionResponse,
} from "./types";

// POST /completions
export async function completeTask(
  request: CompleteTaskRequest
): Promise<ApiResponse<TaskCompletionResponse>> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return await apiClient.post<ApiResponse<TaskCompletionResponse>>(
    "/completions",
    { ...request, timezone }
  );
}

// GET /completions/history
export async function getCompletionHistory(
  params?: CompletionHistoryParams
): Promise<ApiResponse<TaskCompletion[]>> {
  return await apiClient.get<ApiResponse<TaskCompletion[]>>(
    "/completions/history",
    params
  );
}

// GET /completions/stats
export async function getCompletionStats(
  params?: CompletionStatsParams
): Promise<ApiResponse<CompletionStatsResponse>> {
  return await apiClient.get<ApiResponse<CompletionStatsResponse>>(
    "/completions/stats",
    params
  );
}
