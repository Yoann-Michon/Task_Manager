import type { ChangePasswordData, LoginData, User } from '../models/user.interface';
import { api } from './api.service';

export const userService = {

  register: async (data: User): Promise<Response> => {
    return api<Response>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },


  login: async (data: LoginData): Promise<Response> => {
    return api<Response>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    return api('/auth/logout', {
      method: 'POST',
    });
  },

  getProfile: async (): Promise<User> => {
    return api('/auth/profile');
  },

  updateProfile: async (data: User): Promise<Response> => {
    return api<Response>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    return api<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  checkAuth: async (): Promise<boolean> => {
    try {
      await userService.getProfile();
      return true;
    } catch {
      return false;
    }
  },
};

export default userService;