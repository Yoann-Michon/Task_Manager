import { useRef } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag, type DragSourceMonitor } from 'react-dnd';
import type { TaskItemProps, TaskType } from '../../models/tasks.interface';
import { useThemeColors } from '../ThemeModeContext';
import { 
  TASK_TYPE_LABELS, 
  TASK_TYPE_COLORS, 
  TASK_TYPE_ICONS 
} from '../../models/tasks.interface';

const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
    const colors = useThemeColors();
    const dragRef = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'task',
        item: { id: task.id, status: task.status, task },
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(dragRef);

    const formatDate = (dateString?: string): string => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const taskType: TaskType = (task.type as TaskType) || 'other';
    const typeColor = TASK_TYPE_COLORS[taskType];
    const typeLabel = TASK_TYPE_LABELS[taskType];
    const IconComponent = TASK_TYPE_ICONS[taskType];

    return (
        <Box
            ref={dragRef}
            style={{
                marginBottom: 16,
                cursor: 'move',
                opacity: isDragging ? 0.5 : 1,
                transform: isDragging ? 'rotate(5deg)' : 'none',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
            }}
        >
            <Card
                sx={{
                    backgroundColor: colors.background.paper,
                    borderLeft: `4px solid ${typeColor}`,
                    '&:hover': {
                        boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
                        transform: isDragging ? 'none' : 'translateY(-2px)',
                    },
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
            >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                color: colors.text.primary,
                                fontWeight: 600,
                                flexGrow: 1,
                                pr: 1,
                                lineHeight: 1.4
                            }}
                        >
                            {task.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                            {onEdit && (
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(task);
                                    }}
                                    sx={{
                                        color: colors.text.tertiary,
                                        '&:hover': { color: colors.primary }
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                            {onDelete && task.id !== undefined && (
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(task.id!);
                                    }}
                                    sx={{
                                        color: colors.text.tertiary,
                                        '&:hover': { color: colors.error }
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                     }}>
                        <Chip
                            icon={<IconComponent sx={{ fontSize: '0.85rem', color: typeColor }} />}
                            label={typeLabel}
                            size="small"
                            sx={{
                                backgroundColor: `${typeColor}20`,
                                color: typeColor,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                height: 22,
                                border: `1px solid ${typeColor}40`,
                                '& .MuiChip-label': {
                                    px: 1
                                },
                                '& .MuiChip-icon': {
                                    color: typeColor,
                                    marginLeft: '4px'
                                }
                            }}
                        />
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: colors.text.tertiary,
                                fontSize: '0.7rem'
                            }}
                        >
                            {task.status === 'done' && task.completedAt 
                                ? formatDate(task.completedAt)
                                : task.createdAt 
                                ? formatDate(task.createdAt)
                                : ''
                            }
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TaskItem;