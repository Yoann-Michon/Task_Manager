export type Language = 'fr' | 'en' | 'es' | 'de';
export type Theme = 'light' | 'dark';

export interface Setting {
  id: number;
  language?: Language;
  theme?: Theme;
}