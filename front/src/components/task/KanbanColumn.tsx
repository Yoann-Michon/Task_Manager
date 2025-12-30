import { useRef } from 'react';
import { Box, Typography, Paper, Badge } from '@mui/material';
import { useDrop } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../ThemeModeContext';
import type { KanbanColumnProps } from '../../models/tasks.interface';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskItem from './TaskItem';
import BoltIcon from '@mui/icons-material/Bolt';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PushPinIcon from '@mui/icons-material/PushPin';

const KanbanColumn = ({ 
    column, 
    onTaskMove, 
    onTaskEdit, 
    onTaskDelete 
}: KanbanColumnProps) => {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const dropRef = useRef<HTMLDivElement>(null);

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'task',
        drop: (item: { id: number; status: string }) => {
            if (item.status !== column.id) {
                onTaskMove(item.id, column.id);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    drop(dropRef);

    const getColumnInfo = (columnId: string) => {
        switch (columnId) {
            case 'todo': 
                return { color: colors.text.tertiary, icon: AssignmentIcon };
            case 'pending': 
                return { color: colors.warning, icon: BoltIcon };
            case 'done': 
                return { color: colors.success, icon: DoneAllIcon };
            default: 
                return { color: colors.primary, icon: PushPinIcon };
        }
    };

    const columnInfo = getColumnInfo(column.id);
    const Icon = columnInfo.icon;

    return (
        <Box
            ref={dropRef}
            sx={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                mx: 1,
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: colors.background.paper,
                    border: `2px solid ${isOver && canDrop ? columnInfo.color : 'transparent'}`,
                    borderRadius: 3,
                    transition: 'border-color 0.3s ease, background-color 0.3s ease',
                    ...(isOver && canDrop && {
                        backgroundColor: `${columnInfo.color}08`,
                    }),
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 3,
                    pb: 2,
                    borderBottom: `2px solid ${colors.divider}`
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon sx={{ color: columnInfo.color }} />
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: colors.text.primary,
                                fontWeight: 600,
                                fontSize: '1.1rem'
                            }}
                        >
                            {column.title}
                        </Typography>
                    </Box>
                    <Badge 
                        badgeContent={column.tasks.length} 
                        sx={{
                            '& .MuiBadge-badge': {
                                backgroundColor: columnInfo.color,
                                color: colors.background.paper,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                            }
                        }}
                    />
                </Box>

                {column.tasks.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '200px',
                            border: `2px dashed ${colors.divider}`,
                            borderRadius: 2,
                            color: colors.text.tertiary,
                            textAlign: 'center',
                            p: 3,
                            ...(isOver && canDrop && {
                                borderColor: columnInfo.color,
                                backgroundColor: `${columnInfo.color}10`,
                            }),
                        }}
                    >
                        <Icon sx={{ fontSize: '2rem', mb: 1, color: colors.text.tertiary }} />
                        <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                            {isOver && canDrop 
                                ? t('pages.tasks.dragDrop.dropTask')
                                : `${t('pages.tasks.dragDrop.noTasks')} "${column.title}"`}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 1 }}>
                        {column.tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onEdit={onTaskEdit}
                                onDelete={onTaskDelete}
                            />
                        ))}
                        
                        {isOver && canDrop && (
                            <Box
                                sx={{
                                    height: '60px',
                                    border: `2px dashed ${columnInfo.color}`,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: `${columnInfo.color}10`,
                                    mb: 2,
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: columnInfo.color,
                                        fontWeight: 600
                                    }}
                                >
                                    {t('pages.tasks.dragDrop.dropHere')}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default KanbanColumn;
