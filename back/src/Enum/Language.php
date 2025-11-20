<?php

namespace App\Enum;

enum Language: string
{
    case FR = 'fr';
    case EN = 'en';
    case ES = 'es';
    case DE = 'de';

    public function getLabel(): string
    {
        return match($this) {
            self::FR => 'Français',
            self::EN => 'English',
            self::ES => 'Español',
            self::DE => 'Deutsch',
        };
    }
}
