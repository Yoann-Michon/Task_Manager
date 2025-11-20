<?php

namespace App\Enum;

enum TaskStatus: string
{
    case TODO = 'todo';
    case PENDING = 'pending';
    case DONE = 'done';

    public function getLabel(): string
    {
        return match($this) {
            self::TODO => 'todo',
            self::PENDING => 'pending',
            self::DONE => 'done',
        };
    }
}


enum TaskType: string
{
    case FEATURE = 'feature';
    case FIX = 'fix';
    case IMPROVEMENT = 'improvement';
    case DOCUMENTATION = 'documentation';
    case REFACTORING = 'refactoring';
    case TEST = 'test';
    case OTHER = 'other';

    public function getLabel(): string
    {
        return match($this) {
            self::FEATURE => 'Feature',
            self::FIX => 'Fix',
            self::IMPROVEMENT => 'Improvement',
            self::DOCUMENTATION => 'Documentation',
            self::REFACTORING => 'Refactoring',
            self::TEST => 'Test',
            self::OTHER => 'Other',
        };
    }

    public function getColor(): string
    {
        return match($this) {
            self::FEATURE => '#3D99F5',
            self::FIX => '#EF4444',
            self::IMPROVEMENT => '#10B981',
            self::DOCUMENTATION => '#8B5CF6',
            self::REFACTORING => '#F59E0B',
            self::TEST => '#06B6D4',
            self::OTHER => '#6B7280',
        };
    }
}
