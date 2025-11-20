<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use App\Entity\User;
use App\Service\AuthService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/auth')]
final class AuthController extends AbstractController
{
    private const ERROR_UNAUTHENTICATED = 'error.unauthenticated';
    public function __construct(
        private AuthService $authService,
        private LoggerInterface $logger
    ) {}

    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $this->logger->info('Register attempt', ['email' => $data['email'] ?? 'unknown']);

        $result = $this->authService->registerUser($data);

        if (isset($result['error']) || isset($result['errors'])) {
            $this->logger->error('Registration failed - FULL DETAILS', [
                'error' => $result['error'] ?? 'no error key',
                'message' => $result['message'] ?? 'no message',
                'file' => $result['file'] ?? 'no file',
                'line' => $result['line'] ?? 'no line',
                'full_result' => json_encode($result)
            ]);

            $this->logger->warning('Registration failed', ['result' => $result]);

            return $this->json($result, $result['code'] ?? 500);
        }

        $this->logger->info('User registered successfully', ['user_id' => $result['user']['id']]);
        return $this->json([
            'message' => $result['message'],
            'user' => $result['user']
        ], $result['code']);
    }

    #[Route('/profile', name: 'api_profile', methods: ['GET'])]
    public function profile(): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        $profile = $this->authService->getUserProfile($user);
        return $this->json($profile);
    }

    #[Route('/profile', name: 'api_update_profile', methods: ['PUT'])]
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        $data = json_decode($request->getContent(), true);
        $result = $this->authService->updateProfile($user, $data);

        if (!$result) {
            return $this->json(
                isset($result['errors']) ? ['errors' => $result['errors']] : ['error' => $result['error']],
                $result['code']
            );
        }

        return $this->json([
            'message' => $result['message'],
            'user' => $result['user']
        ], $result['code']);
    }

    #[Route('/change-password', name: 'api_change_password', methods: ['POST'])]
    public function changePassword(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        $data = json_decode($request->getContent(), true);
        $result = $this->authService->changePassword($user, $data);

        if (!$result) {
            return $this->json(['error' => $result['error']], $result['code']);
        }

        return $this->json(['message' => $result['message']], $result['code']);
    }

    private function getAuthenticatedUser(): ?User
    {
        $user = $this->getUser();
        return $user instanceof User ? $user : null;
    }
}
