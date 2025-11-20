<?php
namespace App\Enum;

enum UserRole: string
{
    case ROLE_USER = 'user';
    case ROLE_ADMIN = 'admin';

    public function getLabel(): string
    {
        return match($this) {
            self::ROLE_USER => 'User',
            self::ROLE_ADMIN => 'Admin',
        };
    }
}
