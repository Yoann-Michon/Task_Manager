import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '../components/ThemeModeContext';
import { taskService } from '../services/Task.service';
import type { Column, Task, TaskType } from '../models/tasks.interface';
import KanbanColumn from '../components/task/KanbanColumn';
import TaskModal from '../components/task/TaskModal';
import { BounceLoading } from 'respinner';

const Home = () => {
    const { t } = useTranslation();
    const colors = useThemeColors();
    
    const [columns, setColumns] = useState<Column[]>([
        { id: 'todo', title: t('pages.tasks.columns.todo'), tasks: [] },
        { id: 'pending', title: t('pages.tasks.columns.inprogress'), tasks: [] },
        { id: 'done', title: t('pages.tasks.columns.done'), tasks: [] }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskType, setTaskType] = useState<TaskType>('other'); 
    const [taskDescription, setTaskDescription] = useState(''); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const tasks = await taskService.getAll();
            setColumns([
                {
                    id: 'todo',
                    title: t('pages.tasks.columns.todo'),
                    tasks: tasks.filter(task => task.status === 'todo')
                },
                {
                    id: 'pending',
                    title: t('pages.tasks.columns.inprogress'),
                    tasks: tasks.filter(task => task.status === 'pending')
                },
                {
                    id: 'done',
                    title: t('pages.tasks.columns.done'),
                    tasks: tasks.filter(task => task.status === 'done')
                }
            ]);
        } catch (error) {
            console.error('Erreur lors du chargement des tâches:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setColumns(prevColumns => 
            prevColumns.map(column => ({
                ...column,
                title: column.id === 'todo' 
                    ? t('pages.tasks.columns.todo')
                    : column.id === 'pending'
                    ? t('pages.tasks.columns.inprogress')
                    : t('pages.tasks.columns.done')
            }))
        );
    }, [t]);

    const handleTaskMove = useCallback(async (
        taskId: number, 
        newStatus: 'todo' | 'pending' | 'done'
    ) => {
        try {
            setColumns(prevColumns => {
                let taskToMove: Task | null = null;
                
                const updatedColumns = prevColumns.map(column => {
                    const taskIndex = column.tasks.findIndex(task => task.id === taskId);
                    if (taskIndex >= 0) {
                        taskToMove = { ...column.tasks[taskIndex], status: newStatus };
                        return {
                            ...column,
                            tasks: column.tasks.filter(task => task.id !== taskId)
                        };
                    }
                    return column;
                });

                if (taskToMove) {
                    return updatedColumns.map(column => 
                        column.id === newStatus
                            ? { ...column, tasks: [...column.tasks, taskToMove!] }
                            : column
                    );
                }
                
                return updatedColumns;
            });

            await taskService.changeStatus(taskId, newStatus);
        } catch (error) {
            console.error('Erreur lors du déplacement:', error);
            loadTasks();
        }
    }, []);

    const handleAddTask = () => {
        setEditingTask(null);
        setTaskTitle('');
        setTaskType('other'); 
        setTaskDescription(''); 
        setError('');
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setTaskTitle(task.title || '');
        setTaskType(task.type || 'other'); 
        setTaskDescription(task.description || ''); 
        setError('');
        setIsModalOpen(true);
    };

    // ✅ MODIFIÉ : Ajout des paramètres type et description
    const handleSaveTask = async (title: string, type?: TaskType, description?: string) => {
        if (!title.trim()) {
            setError(t('pages.tasks.modal.titleRequired'));
            return;
        }

        try {
            const taskData = {
                title: title.trim(),
                type: type || taskType || 'other', 
                description: description?.trim() || '', 
            };

            if (editingTask?.id) {
                const updatedTask = await taskService.update(editingTask.id, {
                    ...editingTask,
                    ...taskData,
                });

                setColumns(prevColumns =>
                    prevColumns.map(column => ({
                        ...column,
                        tasks: column.tasks.map(task => 
                            task.id === updatedTask.id ? updatedTask : task
                        )
                    }))
                );
            } else {
                const newTask = await taskService.create({
                    ...taskData,
                    status: 'todo',
                });

                setColumns(prevColumns =>
                    prevColumns.map(column =>
                        column.id === 'todo'
                            ? { ...column, tasks: [...column.tasks, newTask] }
                            : column
                    )
                );
            }

            setIsModalOpen(false);
            setError('');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setError('Une erreur est survenue');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (globalThis.confirm(t('pages.tasks.confirmDelete'))) {
            try {
                await taskService.delete(taskId);
                
                setColumns(prevColumns =>
                    prevColumns.map(column => ({
                        ...column,
                        tasks: column.tasks.filter(task => task.id !== taskId)
                    }))
                );
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const totalTasks = columns.reduce((total, column) => total + column.tasks.length, 0);

    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 300 }}>
                <BounceLoading gap={5} />
                <Typography sx={{ mt: 2 }}>Chargement...</Typography>
            </Box>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: colors.background.default }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3 
                }}>
                    <Box>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                color: colors.text.primary,
                                fontWeight: 700,
                                mb: 1
                            }}
                        >
                            {t('pages.home.title')}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ color: colors.text.tertiary }}
                        >
                            {totalTasks} {totalTasks === 1 
                                ? t('pages.home.subtitle').split(' | ')[0] 
                                : t('pages.home.subtitle').split(' | ')[1]
                            }
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddTask}
                        sx={{
                            backgroundColor: colors.primary,
                            color: colors.text.primary,
                            '&:hover': {
                                backgroundColor: colors.iconSelected,
                            },
                            borderRadius: '12px',
                            px: 3
                        }}
                    >
                        {t('pages.home.newTask')}
                    </Button>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flex: 1,
                    minHeight: 0,
                    overflow: 'hidden'
                }}>
                    {columns.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            onTaskMove={handleTaskMove}
                            onTaskEdit={handleEditTask}
                            onTaskDelete={handleDeleteTask}
                        />
                    ))}
                </Box>

                <TaskModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTask}
                    editingTask={editingTask}
                    taskTitle={taskTitle}
                    setTaskTitle={setTaskTitle}
                    taskType={taskType} 
                    setTaskType={setTaskType} 
                    taskDescription={taskDescription} 
                    setTaskDescription={setTaskDescription} 
                    error={error}
                />
            </Box>
        </DndProvider>
    );
};

export default Home;