import { apiClient } from './client';
import { ApiResponse, QuestionnaireQuestion } from './types';

// GET /questionnaire
export async function getQuestions(): Promise<ApiResponse<QuestionnaireQuestion[]>> {
  return await apiClient.get<ApiResponse<QuestionnaireQuestion[]>>('/questionnaire');
}