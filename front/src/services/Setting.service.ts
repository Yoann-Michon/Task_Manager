import type { Language, Setting, Theme } from '../models/setting.interface';
import { api } from './api.service';

export const settingService = {

  get: async (): Promise<Response> => {
    return api<Response>('/settings');
  },

  update: async (data: Partial<Setting>): Promise<Response> => {
    return api<Response>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changeLanguage: async (language: Language): Promise<Response> => {
    return settingService.update({ language });
  },

  changeTheme: async (theme: Theme): Promise<Response> => {
    return settingService.update({ theme });
  },

  toggleTheme: async (currentTheme: Theme): Promise<Response> => {
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    return settingService.changeTheme(newTheme);
  },
};

export default settingService;