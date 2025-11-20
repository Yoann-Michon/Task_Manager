<?php

namespace App\Service;

use App\Entity\Task;
use App\Entity\User;
use App\Enum\TaskStatus;
use App\Enum\TaskType;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TaskService
{
    public function __construct(
        private EntityManagerInterface $em,
        private TaskRepository $taskRepository,
        private ValidatorInterface $validator
    ) {}

    public function createTask(User $user, array $data): array
    {
        try {
            if (!isset($data['title']) || trim($data['title']) === '') {
                return ['error' => 'error.empty_title', 'code' => 400];
            }

            $task = new Task();
            $task->setTitle(trim($data['title']));
            $task->setUser($user);

            // Gérer la description (optionnelle)
            if (isset($data['description'])) {
                $task->setDescription(trim($data['description']));
            }

            // Gérer le statut
            if (isset($data['status'])) {
                $taskStatus = TaskStatus::tryFrom($data['status']);
                if ($taskStatus) {
                    $task->setStatus($taskStatus);
                }
            }

            if (isset($data['type'])) {
                $taskType = TaskType::tryFrom($data['type']);
                if ($taskType) {
                    $task->setType($taskType);
                } else {
                    return ['error' => 'error.invalid_task_type', 'code' => 400];
                }
            }

            $errors = $this->validator->validate($task);
            if (count($errors) > 0) {
                $errorMessages = array_map(fn($e) => $e->getMessage(), iterator_to_array($errors));
                return ['errors' => $errorMessages, 'code' => 400];
            }

            $this->em->persist($task);
            $this->em->flush();

            return ['task' => $task, 'code' => 201];
        } catch (\Exception $e) {
            return ['error' => 'error.creating_task', 'details' => $e->getMessage(), 'code' => 500];
        }
    }

    public function updateTask(Task $task, array $data): array
    {
        try {
            if (isset($data['title'])) {
                if (trim($data['title']) === '') {
                    return ['error' => 'error.empty_title', 'code' => 400];
                }
                $task->setTitle(trim($data['title']));
            }

            // Gérer la description
            if (isset($data['description'])) {
                $task->setDescription(trim($data['description']));
            }

            if (isset($data['status'])) {
                $taskStatus = TaskStatus::tryFrom($data['status']);
                if ($taskStatus) {
                    $task->setStatus($taskStatus);
                } else {
                    return ['error' => 'error.invalid_status', 'code' => 400];
                }
            }

            if (isset($data['type'])) {
                $taskType = TaskType::tryFrom($data['type']);
                if ($taskType) {
                    $task->setType($taskType);
                } else {
                    return ['error' => 'error.invalid_task_type', 'code' => 400];
                }
            }

            $errors = $this->validator->validate($task);
            if (count($errors) > 0) {
                $errorMessages = array_map(fn($e) => $e->getMessage(), iterator_to_array($errors));
                return ['errors' => $errorMessages, 'code' => 400];
            }

            $this->em->flush();
            return ['task' => $task, 'code' => 200];
        } catch (\Exception $e) {
            return ['error' => 'error.updating_task', 'details' => $e->getMessage(), 'code' => 500];
        }
    }

    public function deleteTask(Task $task): array
    {
        try {
            $this->em->remove($task);
            $this->em->flush();

            return ['message' => 'Tâche supprimée avec succès', 'code' => 200];
        } catch (\Exception $e) {
            return ['error' => 'error.deleting_task', 'details' => $e->getMessage(), 'code' => 500];
        }
    }

    public function getUserTasks(User $user): array
    {
        try {
            $tasks = $this->taskRepository->findBy(
                ['user' => $user],
                ['createdAt' => 'DESC']
            );

            return ['tasks' => $tasks];
        } catch (\Exception $e) {
            return ['tasks' => [], 'error' => 'error.fetching_tasks', 'details' => $e->getMessage()];
        }
    }

    public function getTaskStats(User $user): array
    {
        try {
            $totalTasks = $this->taskRepository->count(['user' => $user]);
            $todoTasks = $this->taskRepository->count(['user' => $user, 'status' => TaskStatus::TODO]);
            $pendingTasks = $this->taskRepository->count(['user' => $user, 'status' => TaskStatus::PENDING]);
            $doneTasks = $this->taskRepository->count(['user' => $user, 'status' => TaskStatus::DONE]);

            $typeStats = [];
            foreach (TaskType::cases() as $type) {
                $typeStats[$type->value] = $this->taskRepository->count([
                    'user' => $user,
                    'type' => $type
                ]);
            }

            return [
                'total_tasks' => $totalTasks,
                'todo_tasks' => $todoTasks,
                'pending_tasks' => $pendingTasks,
                'done_tasks' => $doneTasks,
                'completion_rate' => $totalTasks > 0 ? round(($doneTasks / $totalTasks) * 100, 2) : 0,
                'by_type' => $typeStats
            ];
        } catch (\Exception $e) {
            return [
                'total_tasks' => 0,
                'todo_tasks' => 0,
                'pending_tasks' => 0,
                'done_tasks' => 0,
                'completion_rate' => 0,
                'by_type' => [],
                'error' => 'error.fetching_stats',
                'details' => $e->getMessage()
            ];
        }
    }

    public function isUserOwner(Task $task, User $user): bool
    {
        try {
            return $task->getUser() === $user;
        } catch (\Exception) {
            return false;
        }
    }
}
