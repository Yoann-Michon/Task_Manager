import { IconButton, Stack, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';

const languages = ['en', 'fr'];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const currentIndex = languages.indexOf(currentLang);
  const nextLang = (delta: number) => {
    const newIndex = (currentIndex + delta + languages.length) % languages.length;
    i18n.changeLanguage(languages[newIndex]);
    localStorage.setItem('i18nextLng', languages[newIndex]);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton onClick={() => nextLang(-1)}>
        <ChevronLeftIcon />
      </IconButton>
      <Typography variant="body1" sx={{ minWidth: 32, textAlign: 'center' }}>
        {currentLang.toUpperCase()}
      </Typography>
      <IconButton onClick={() => nextLang(1)}>
        <ChevronRightIcon />
      </IconButton>
    </Stack>
  );
};

export default LanguageSelector;
