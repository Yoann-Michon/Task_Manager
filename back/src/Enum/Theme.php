<?php

namespace App\Enum;

enum Theme: string
{
    case LIGHT = 'light';
    case DARK = 'dark';

    public function getLabel(): string
    {
        return match($this) {
            self::LIGHT => 'light',
            self::DARK => 'dark',
        };
    }
}
