<?php

namespace App\Entity;

use App\Enum\Language;
use App\Enum\Theme;
use App\Repository\SettingRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SettingRepository::class)]
#[ORM\Table(name: '`setting`')]
class Setting
{
    private const GROUP_SETTING_READ  = 'setting:read';
    private const GROUP_SETTING_WRITE = 'setting:write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::GROUP_SETTING_READ])]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 10, enumType: Language::class)]
    #[Groups([self::GROUP_SETTING_READ, self::GROUP_SETTING_WRITE])]
    private Language $language = Language::FR;

    #[ORM\Column(type: "string", length: 10, enumType: Theme::class)]
    #[Groups([self::GROUP_SETTING_READ, self::GROUP_SETTING_WRITE])]
    private Theme $theme = Theme::LIGHT;

    #[ORM\OneToOne(inversedBy: 'setting', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function __construct()
    {
        $this->language = Language::FR;
        $this->theme = Theme::LIGHT;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLanguage(): Language
    {
        return $this->language;
    }

    public function setLanguage(Language $language): static
    {
        $this->language = $language;
        return $this;
    }

    public function getTheme(): Theme
    {
        return $this->theme;
    }

    public function setTheme(Theme $theme): static
    {
        $this->theme = $theme;
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
}
