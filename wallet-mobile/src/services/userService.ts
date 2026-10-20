import { User } from '@/models';

import { apiClient } from './api/apiClient';

const BASE_PATH = '/users';

export const userService = {
  getById: (id: number) => apiClient.get<User>(`${BASE_PATH}/${id}`),
  update: (id: number, user: Partial<User>) => apiClient.put<User>(`${BASE_PATH}/${id}`, user),
};
