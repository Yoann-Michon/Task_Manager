<?php

namespace App\Controller;

use App\Entity\Task;
use App\Entity\User;
use App\Service\TaskService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/tasks')]
final class TaskController extends AbstractController
{
    private const ERROR_UNAUTHENTICATED = 'error.not_authenticated';
    private const ERROR_NOT_FOUND = 'error.task_not_found';

    public function __construct(
        private TaskService $taskService,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'api_tasks_all', methods: ['GET'])]
    public function getAllTasks(): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        $result = $this->taskService->getUserTasks($user);

        $jsonTasks = $this->serializer->serialize(
            $result['tasks'],
            'json',
            ['groups' => 'task:read']
        );

        return new JsonResponse(json_decode($jsonTasks, true));
    }

    #[Route('/{id}', name: 'api_tasks_show', methods: ['GET'])]
    public function getOneTask(Task $task): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        if (!$this->taskService->isUserOwner($task, $user)) {
            return $this->json(['error' => self::ERROR_NOT_FOUND], 404);
        }

        $jsonTask = $this->serializer->serialize(
            $task,
            'json',
            ['groups' => 'task:read']
        );

        return new JsonResponse(json_decode($jsonTask, true));
    }

    #[Route('', name: 'api_tasks_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        $data = json_decode($request->getContent(), true);
        
        $result = $this->taskService->createTask($user, $data);

        if (isset($result['error']) || isset($result['errors'])) {
            return $this->json(
                isset($result['errors']) ? ['errors' => $result['errors']] : ['error' => $result['error']],
                $result['code']
            );
        }

        $jsonTask = $this->serializer->serialize(
            $result['task'],
            'json',
            ['groups' => 'task:read']
        );

        return new JsonResponse(json_decode($jsonTask, true), $result['code']);
    }

    
    #[Route('/{id}', name: 'api_tasks_update', methods: ['PUT'])]
    public function update(Task $task, Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        if (!$this->taskService->isUserOwner($task, $user)) {
            return $this->json(['error' => self::ERROR_NOT_FOUND], 404);
        }

        $data = json_decode($request->getContent(), true);
        $result = $this->taskService->updateTask($task, $data);

        if (isset($result['error']) || isset($result['errors'])) {
            return $this->json(
                isset($result['errors']) ? ['errors' => $result['errors']] : ['error' => $result['error']],
                $result['code']
            );
        }

        $jsonTask = $this->serializer->serialize(
            $result['task'],
            'json',
            ['groups' => 'task:read']
        );

        return new JsonResponse(json_decode($jsonTask, true));
    }

    
    #[Route('/{id}', name: 'api_tasks_delete', methods: ['DELETE'])]
    public function delete(Task $task): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        if (!$this->taskService->isUserOwner($task, $user)) {
            return $this->json(['error' => self::ERROR_NOT_FOUND], 404);
        }

        $result = $this->taskService->deleteTask($task);

        return $this->json(['message' => $result['message']]);
    }

    #[Route('/stats', name: 'api_tasks_stats', methods: ['GET'])]
    public function stats(): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        $stats = $this->taskService->getTaskStats($user);

        return $this->json($stats);
    }

    private function getAuthenticatedUser(): ?User
    {
        $user = $this->getUser();
        return $user instanceof User ? $user : null;
    }
}
