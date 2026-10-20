import { Expense, ExpenseRequest } from '@/models';

import { apiClient } from './api/apiClient';

const BASE_PATH = '/expenses';

export const expenseService = {
  getAll: () => apiClient.get<Expense[]>(BASE_PATH),
  getById: (id: number) => apiClient.get<Expense>(`${BASE_PATH}/${id}`),
  create: (expense: ExpenseRequest) => apiClient.post<Expense>(BASE_PATH, expense),
  update: (id: number, expense: ExpenseRequest) => apiClient.put<Expense>(`${BASE_PATH}/${id}`, expense),
  remove: (id: number) => apiClient.delete(`${BASE_PATH}/${id}`),
};
