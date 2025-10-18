// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
  details?: any;
}

// User related types
export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  instagramHandle: string | null;
  gender: string | null;
  phone: string | null;
  countryCode: string | null;
  profileImage: string | null;
  createdAt: string;
  joinedAt: string | null;
  inviteCode: string | null;
  referrerInviteCode: string | null;
  hasAccess: boolean;
  needsPurchase: boolean;
  disciplineScore: number | null;
  mindsetScore: number | null;
  strengthScore: number | null;
  momentumScore: number | null;
  confidenceScore: number | null;
  societyScore: number | null;
  initialDisciplineScore: number | null;
  initialMindsetScore: number | null;
  initialStrengthScore: number | null;
  initialMomentumScore: number | null;
  initialConfidenceScore: number | null;
  physicalStats: Record<string, any> | null;
  winterArcStartDate: string | null;
  onboardingDone: boolean;
  lastSyncDate: string | null;
}

export interface UserScores {
  current: {
    discipline: number | null;
    mindset: number | null;
    strength: number | null;
    momentum: number | null;
    confidence: number | null;
    society: number | null;
  };
  initial: {
    discipline: number | null;
    mindset: number | null;
    strength: number | null;
    momentum: number | null;
    confidence: number | null;
  };
  progress: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
  };
}

// Authentication types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface GoogleSignInRequest {
  token: string;
}

// Profile completion types
export interface CompleteProfileRequest {
  firstName: string;
  lastName: string;
  instagramHandle: string;
  gender: string;
  phone?: string;
  countryCode?: string;
}

export interface InviteCodeRequest {
  referrerInviteCode?: string;
}

export interface PhysicalStatsRequest {
  physicalStats: Record<string, any>;
}

export interface WinterArcStartRequest {
  startDate: string;
  timezone?: string;
}

// Questionnaire types
export interface QuestionnaireOption {
  value: number | string;
  label: string;
}

export interface QuestionnaireQuestion {
  id: number;
  question: string;
  type: string;
  questionType: string;
  key: string;
  options?: QuestionnaireOption[];
  min?: number;
  max?: number;
  step?: number;
  scoreMapping: any;
}

export interface QuestionnaireResponse {
  responses: Record<string, any>;
}

// Task and routine types
export interface TaskOption {
  name: string;
  type: string;
  default: any;
}

export interface Task {
  id: number;
  name: string;
  text: string;
  category: string;
  options: TaskOption[];
  isMandatory: boolean;
  canCustomizeCadence: boolean;
  disciplineImpact: number;
  mindsetImpact: number;
  strengthImpact: number;
  momentumImpact: number;
  confidenceImpact: number;
  createdAt: string;
}

export interface UserRoutineOption {
  name: string;
  type: string;
  value: any;
}

export interface UserRoutine {
  id: number;
  taskId: number;
  optionsSet: UserRoutineOption[];
  cadence: number[]; // [1,1,1,0,1,0,0] for Sun-Sat
  isActive: boolean;
  createdAt: string;
  taskName: string;
  taskText: string;
  taskCategory: string;
  taskOptions: TaskOption[];
  isMandatory: boolean;
  canCustomizeCadence: boolean;
  disciplineImpact: number;
  mindsetImpact: number;
  strengthImpact: number;
  momentumImpact: number;
  confidenceImpact: number;
}

export interface RoutineTaskRequest {
  taskId: number;
  optionsSet: UserRoutineOption[];
  cadence: number[];
}

export interface SetCategoryRoutineRequest {
  category: string;
  tasks: RoutineTaskRequest[];
}

// Task completion types
export interface TaskCompletion {
  id: number;
  taskId: number;
  userRoutineId: number;
  completedAt: string;
  disciplineGained: number;
  mindsetGained: number;
  strengthGained: number;
  momentumGained: number;
  confidenceGained: number;
  completionData: any;
  taskName?: string;
  taskCategory?: string;
}

export interface CompleteTaskRequest {
  userRoutineId: number;
  completionData?: any;
}

export interface TaskCompletionResponse {
  completion: TaskCompletion;
  scoreUpdate: {
    gains: {
      disciplineGained: number;
      mindsetGained: number;
      strengthGained: number;
      momentumGained: number;
      confidenceGained: number;
    };
    newScores: {
      discipline: number;
      mindset: number;
      strength: number;
      momentum: number;
      confidence: number;
      society: number;
    };
  };
}

export interface CompletionStats {
  totalCompletions: number;
  totalScoreGained: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
  };
  completionsByCategory: Record<string, number>;
  completionsByDay: Record<string, number>;
}

export interface CompletionStatsResponse {
  period: string;
  startDate: string;
  endDate: string;
  stats: CompletionStats;
}

// API Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Query parameters
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface CompletionHistoryParams extends PaginationParams {
  taskId?: number;
  startDate?: string;
  endDate?: string;
}

export interface TasksParams {
  category?: string;
}

export interface TodayTasksParams {
  timezone?: string;
}

export interface CompletionStatsParams {
  period?: "week" | "month" | "year";
}

// Marketplace and Products types
export interface MarketplaceItem {
  id: number;
  companyName: string;
  description: string;
  imageUrl: string;
  discountCode: string | null;
  discountPercentage: number;
  redirectUrl: string;
  brandType: string;
  featured: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrls: string[];
  initialCost: number;
  discountPercentage: number;
  finalCost: number;
  redirectUrl: string | null;
  category: string;
  tags: string[];
  userRequestedNotification?: boolean;
  userNotified?: boolean;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface MarketplaceListResponse {
  brands: MarketplaceItem[];
  pagination: PaginationMeta;
}

export interface ProductListResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface ProductNotification {
  id: number;
  product: Product;
  isNotified: boolean;
  notifiedAt: string | null;
  requestedAt: string;
}

export interface StoreQueryParams {
  brandType?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sort?: "priority" | "discount" | "name" | "created";
  order?: "asc" | "desc";
  search?: string;
}
