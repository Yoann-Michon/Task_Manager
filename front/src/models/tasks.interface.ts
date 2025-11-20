import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import BuildIcon from '@mui/icons-material/Build';
import ScienceIcon from '@mui/icons-material/Science';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export type TaskType = 'feature' | 'fix' | 'improvement' | 'documentation' | 'refactor' | 'test' | 'other';

export type TaskStatus = 'todo' | 'pending' | 'done';

export interface Task {
    id?: number;
    title?: string;
    status?: TaskStatus;
    description?: string;
    type?: TaskType;
    createdAt?: string;
    completedAt?: string;
}

export interface TaskStats {
  total_tasks: number;
  todo_tasks: number;
  pending_tasks: number;
  done_tasks: number;
  completion_rate: number;
}

export interface Column {
    id: TaskStatus;
    title: string;
    tasks: Task[];
}

export interface TaskItemProps {
    task: Task;
    onEdit?: (task: Task) => void;
    onDelete?: (taskId: number) => void;
}

export interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, type?: TaskType, description?: string) => void;
  editingTask: Task | null;
  taskTitle: string;
  setTaskTitle: (value: string) => void;
  taskType: TaskType;
  setTaskType: (value: TaskType) => void;
  taskDescription: string;
  setTaskDescription: (value: string) => void;
  error: string;
}

export interface KanbanColumnProps {
    column: Column;
    onTaskMove: (taskId: number, newStatus: TaskStatus) => void;
    onTaskEdit?: (task: Task) => void;
    onTaskDelete?: (taskId: number) => void;
}

// Constantes pour les labels des types de tâches
export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  feature: 'Feature',
  fix: 'Fix',
  improvement: 'Improvement',
  documentation: 'Documentation',
  refactor: 'Refactor',
  test: 'Test',
  other: 'Other'
};

// Constantes pour les couleurs des types de tâches
export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  feature: '#3D99F5',      // Bleu
  fix: '#EF4444',          // Rouge
  improvement: '#10B981',  // Vert
  documentation: '#8B5CF6', // Violet
  refactor: '#F59E0B',     // Orange
  test: '#EC4899',         // Rose
  other: '#6B7280'         // Gris
};

// Constantes pour les icônes des types de tâches (composants, pas ReactElement)
export const TASK_TYPE_ICONS = {
  feature: CodeIcon,
  fix: BugReportIcon,
  improvement: TrendingUpIcon,
  documentation: DescriptionIcon,
  refactor: BuildIcon,
  test: ScienceIcon,
  other: MoreHorizIcon
} as const;

// Helper pour obtenir les types de tâches disponibles
export const getTaskTypes = (): TaskType[] => {
  return Object.keys(TASK_TYPE_LABELS) as TaskType[];
};