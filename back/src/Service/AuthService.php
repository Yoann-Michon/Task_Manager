<?php

namespace App\Service;

use App\Entity\User;
use App\Enum\UserRole;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthService
{
    private const MIN_PASSWORD_LENGTH = 6;

    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator
    ) {}

    public function registerUser(array $data): array
    {
        try {
            if (!isset($data['name'], $data['email'], $data['password'])) {
                return [
                    'error' => 'error.empty_fields',
                    'code' => 400
                ];
            }

            if ($this->emailExists($data['email'])) {
                return [
                    'error' => 'error.user_already_exist',
                    'code' => 409
                ];
            }

            if (strlen($data['password']) < self::MIN_PASSWORD_LENGTH) {
                return [
                    'error' => 'error.short_password',
                    'code' => 400
                ];
            }

            $user = new User();
            $user->setName($data['name']);
            $user->setEmail($data['email']);
            $user->setRole(
                (isset($data['role']) && $data['role'] === 'admin')
                    ? UserRole::ROLE_ADMIN
                    : UserRole::ROLE_USER
            );

            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return [
                    'errors' => $errorMessages,
                    'code' => 400
                ];
            }

            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            $this->em->persist($user);
            $this->em->flush();

            return [
                'message' => 'user.created',
                'user' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'role' => $user->getRole()->value
                ],
                'code' => 201
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'error.register_user',
                'message' => $e->getMessage(),           // ← Ajoutez cette ligne
                'details' => $e->getMessage(),
                'file' => $e->getFile(),                 // ← Ajoutez cette ligne
                'line' => $e->getLine(),                 // ← Ajoutez cette ligne
                'code' => 500
            ];
        }
    }


    public function updateProfile(User $user, array $data): array
    {
        try {
            if (isset($data['name'])) {
                $user->setName($data['name']);
            }

            if (isset($data['email'])) {
                if ($this->emailExistsForOtherUser($data['email'], $user->getId())) {
                    return [
                        'error' => 'error.email_already_used',
                        'code' => 409
                    ];
                }
                $user->setEmail($data['email']);
            }

            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return [
                    'errors' => $errorMessages,
                    'code' => 400
                ];
            }

            $this->em->flush();

            return [
                'message' => 'profile.updated',
                'user' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'role' => $user->getRole()->value
                ],
                'code' => 200
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'error.updating_profile',
                'details' => $e->getMessage(),
                'code' => 500
            ];
        }
    }

    public function changePassword(User $user, array $data): array
    {
        try {
            if (!isset($data['current_password'], $data['new_password'])) {
                return ['error' => 'error.missing_password_fields', 'code' => 400];
            }

            if (!$this->passwordHasher->isPasswordValid($user, $data['current_password'])) {
                return ['error' => 'error.invalid_current_password', 'code' => 400];
            }

            if (strlen($data['new_password']) < self::MIN_PASSWORD_LENGTH) {
                return ['error' => 'error.short_new_password', 'code' => 400];
            }

            $user->setPassword($this->passwordHasher->hashPassword($user, $data['new_password']));
            $this->em->flush();

            return ['message' => 'password.changed', 'code' => 200];
        } catch (\Exception $e) {
            return [
                'error' => 'error.changing_password',
                'details' => $e->getMessage(),
                'code' => 500
            ];
        }
    }

    public function getUserProfile(User $user): array
    {
        return [
            'user' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'email' => $user->getEmail(),
                'role' => $user->getRole()->value
            ]
        ];
    }

    private function emailExists(string $email): bool
    {
        return $this->em->getRepository(User::class)->findOneBy(['email' => $email]) !== null;
    }

    private function emailExistsForOtherUser(string $email, int $currentUserId): bool
    {
        $existingUser = $this->em->getRepository(User::class)->findOneBy(['email' => $email]);
        return $existingUser && $existingUser->getId() !== $currentUserId;
    }
}
