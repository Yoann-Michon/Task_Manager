<?php

namespace App\Service;

use App\Entity\User;
use App\Enum\Language;
use App\Enum\Theme;
use Doctrine\ORM\EntityManagerInterface;

class SettingService
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {}

    public function getUserSettings(User $user): array
    {
        try {
            $setting = $user->getSetting();

            return [
                'settings' => [
                    'id' => $setting->getId(),
                    'language' => $setting->getLanguage()->value,
                    'theme' => $setting->getTheme()->value
                ]
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'error.fetching_settings',
                'details' => $e->getMessage()
            ];
        }
    }

    public function updateSettings(User $user, array $data): array
    {
        try {
            $setting = $user->getSetting();

            if (isset($data['language'])) {
                $language = Language::tryFrom($data['language']);
                if (!$language) {
                    return ['error' => 'error.invalid_language', 'code' => 400];
                }
                $setting->setLanguage($language);
            }

            if (isset($data['theme'])) {
                $theme = Theme::tryFrom($data['theme']);
                if (!$theme) {
                    return ['error' => 'error.invalid_theme', 'code' => 400];
                }
                $setting->setTheme($theme);
            }

            $this->em->flush();

            return [
                'message' => 'settings.updated',
                'settings' => [
                    'id' => $setting->getId(),
                    'language' => $setting->getLanguage()->value,
                    'theme' => $setting->getTheme()->value
                ],
                'code' => 200
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'error.updating_settings',
                'details' => $e->getMessage(),
                'code' => 500
            ];
        }
    }
}
