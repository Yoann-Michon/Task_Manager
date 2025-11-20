<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\SettingService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/settings')]
final class SettingController extends AbstractController
{
    private const ERROR_UNAUTHENTICATED = 'error.not_authenticated';

    public function __construct(
        private SettingService $settingService
    ) {}

    /**
     * Récupère les paramètres de l'utilisateur connecté
     */
    #[Route('', name: 'api_settings_get', methods: ['GET'])]
    public function getSettings(): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        $result = $this->settingService->getUserSettings($user);

        return $this->json($result);
    }

    /**
     * Modifie les paramètres de l'utilisateur connecté
     */
    #[Route('', name: 'api_settings_update', methods: ['PUT'])]
    public function updateSettings(Request $request): JsonResponse
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->json(['error' => self::ERROR_UNAUTHENTICATED], 401);
        }

        $data = json_decode($request->getContent(), true);
        $result = $this->settingService->updateSettings($user, $data);

        if (isset($result['error'])) {
            return $this->json(
                ['error' => $result['error']],
                $result['code'] ?? 500
            );
        }

        return $this->json([
            'message' => $result['message'],
            'settings' => $result['settings']
        ], $result['code']);
    }

    private function getAuthenticatedUser(): ?User
    {
        $user = $this->getUser();
        return $user instanceof User ? $user : null;
    }
}
