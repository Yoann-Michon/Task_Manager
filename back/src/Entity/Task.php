<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Enum\TaskStatus;
use App\Enum\TaskType;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
#[ORM\Table(name: '`task`')]
class Task
{
    private const GROUP_TASK_READ  = 'task:read';
    private const GROUP_TASK_WRITE = 'task:write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::GROUP_TASK_READ])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 1, max: 255)]
    #[Groups([self::GROUP_TASK_READ, self::GROUP_TASK_WRITE])]
    private ?string $title = null;

    #[ORM\Column(type: "string", length: 20, enumType: TaskStatus::class)]
    #[Groups([self::GROUP_TASK_READ, self::GROUP_TASK_WRITE])]
    private TaskStatus $status = TaskStatus::TODO;

    #[ORM\Column(type: "string", length: 20, enumType: TaskType::class)]
    #[Groups([self::GROUP_TASK_READ, self::GROUP_TASK_WRITE])]
    private TaskType $type = TaskType::OTHER;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::GROUP_TASK_READ, self::GROUP_TASK_WRITE])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups([self::GROUP_TASK_READ])]
    private ?\DateTime $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups([self::GROUP_TASK_READ])]
    private ?\DateTime $completedAt = null;

    #[ORM\ManyToOne(inversedBy: 'tasks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->status = TaskStatus::TODO;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getStatus(): TaskStatus
    {
        return $this->status;
    }

    public function setStatus(TaskStatus $status): static
    {
        $this->status = $status;
        if ($status === TaskStatus::DONE && $this->completedAt === null) {
            $this->completedAt = new \DateTime();
        } elseif ($status !== TaskStatus::DONE) {
            $this->completedAt = null;
        }
        return $this;
    }

    public function getType(): TaskType
    {
        return $this->type;
    }

    public function setType(TaskType $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getCreatedAt(): ?\DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTime $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getCompletedAt(): ?\DateTime
    {
        return $this->completedAt;
    }

    public function setCompletedAt(?\DateTime $completedAt): static
    {
        $this->completedAt = $completedAt;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function isTodo(): bool
    {
        return $this->status === TaskStatus::TODO;
    }

    public function isPending(): bool
    {
        return $this->status === TaskStatus::PENDING;
    }

    public function isDone(): bool
    {
        return $this->status === TaskStatus::DONE;
    }
}
