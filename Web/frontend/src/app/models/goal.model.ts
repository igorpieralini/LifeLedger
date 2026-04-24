export type GoalCategory = 'FINANCIAL' | 'ACADEMIC' | 'SKILLS' | 'HEALTH';
export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface SubTask {
  id: number;
  title: string;
  completed: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: number;
  title: string;
  description: string | null;
  category: GoalCategory;
  status: GoalStatus;
  targetDate: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
  subTasks: SubTask[];
}

export interface GoalRequest {
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate?: string;
  progress?: number;
}

export interface SubTaskRequest {
  title: string;
}

export interface CategoryInfo {
  value: GoalCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { value: 'FINANCIAL', label: 'Financeiras',  icon: 'savings',        color: '#10b981' },
  { value: 'ACADEMIC',  label: 'Acadêmicas',   icon: 'school',         color: '#3b82f6' },
  { value: 'SKILLS',    label: 'Habilidades',  icon: 'bolt',           color: '#8b5cf6' },
  { value: 'HEALTH',    label: 'Saúde',        icon: 'favorite',       color: '#f43f5e' },
];

export const STATUS_LABELS: Record<GoalStatus, string> = {
  NOT_STARTED: 'Não iniciada',
  IN_PROGRESS: 'Em progresso',
  COMPLETED: 'Concluída',
};

export const STATUS_CYCLE: Record<GoalStatus, GoalStatus> = {
  NOT_STARTED: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
  COMPLETED: 'NOT_STARTED',
};

export const SLUG_TO_CATEGORY: Record<string, GoalCategory> = {
  financeiras: 'FINANCIAL',
  academicas: 'ACADEMIC',
  habilidades: 'SKILLS',
  saude: 'HEALTH',
};
