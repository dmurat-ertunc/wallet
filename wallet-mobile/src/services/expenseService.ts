import { Expense, ExpenseRequest } from '@/models';

import { apiClient } from './api/apiClient';

// Backend'deki ExpenseController'ın adresi (API_BASE_URL'in sonuna eklenir)
const BASE_PATH = '/expenses';

// Harcama uç noktaları; her fonksiyon tek bir HTTP isteğidir.
// <...> içindeki tip, backend'den dönen verinin tipini TypeScript'e bildirir.
export const expenseService = {
  // GET /api/expenses → harcama listesi (backend varsayılan olarak en yeni 20 kaydı döner)
  getAll: () => apiClient.get<Expense[]>(BASE_PATH),
  // GET /api/expenses/{id} → tek harcama
  getById: (id: number) => apiClient.get<Expense>(`${BASE_PATH}/${id}`),
  // POST /api/expenses → yeni harcama; cevap olarak id'si ve tarihleri dolmuş kayıt döner
  create: (expense: ExpenseRequest) => apiClient.post<Expense>(BASE_PATH, expense),
  // PUT /api/expenses/{id} → harcamayı tamamen güncelle
  update: (id: number, expense: ExpenseRequest) => apiClient.put<Expense>(`${BASE_PATH}/${id}`, expense),
  // DELETE /api/expenses/{id} → harcamayı sil
  remove: (id: number) => apiClient.delete(`${BASE_PATH}/${id}`),
};
