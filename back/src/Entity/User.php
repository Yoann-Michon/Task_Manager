<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Enum\UserRole;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private const GROUP_USER_READ  = 'user:read';
    private const GROUP_USER_WRITE = 'user:write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups([self::GROUP_USER_READ])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 255)]
    #[Groups([self::GROUP_USER_READ, self::GROUP_USER_WRITE])]
    private ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups([self::GROUP_USER_READ, self::GROUP_USER_WRITE])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(type: "string", length: 20, enumType: UserRole::class)]
    #[Groups([self::GROUP_USER_READ])]
    private UserRole $role = UserRole::ROLE_USER;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Task::class, orphanRemoval: true)]
    private Collection $tasks;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Setting $setting = null;

    public function __construct()
    {
        $this->tasks = new ArrayCollection();
        $this->setting = new Setting();
        $this->setting->setUser($this);
    }

    // Getters & Setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }
    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }
    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }
    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getRole(): UserRole
    {
        return $this->role;
    }
    public function setRole(UserRole $role): static
    {
        $this->role = $role;
        return $this;
    }

    // Méthodes UserInterface
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        return [$this->role->value === 'admin' ? 'ROLE_ADMIN' : 'ROLE_USER'];
    }

    // Gestion des tâches
    public function getTasks(): Collection
    {
        return $this->tasks;
    }

    public function addTask(Task $task): static
    {
        if (!$this->tasks->contains($task)) {
            $this->tasks->add($task);
            $task->setUser($this);
        }
        return $this;
    }

    public function removeTask(Task $task): static
    {
        if ($this->tasks->removeElement($task) && $task->getUser() === $this) {
            $task->setUser(null);
        }
        return $this;
    }

    // Gestion du setting
    public function getSetting(): ?Setting
    {
        return $this->setting;
    }

    public function setSetting(?Setting $setting): static
    {
        if ($setting->getUser() !== null && $setting->getUser() !== $this) {
            $setting->getUser()->setSetting(null);
        }

        $this->setting = $setting;

        if ($setting->getUser() !== $this) {
            $setting->setUser($this);
        }

        return $this;
    }

    public function eraseCredentials(): void
    {
        // This method is required by UserInterface.
        // No temporary sensitive data is stored on this user.
    }
}
