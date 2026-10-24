import { User } from '@/models';

import { apiClient } from './api/apiClient';

// Backend'deki kullanıcı uç noktalarının adresi
const BASE_PATH = '/users';

// Kullanıcı uç noktaları. Hazır duruyor ama henüz hiçbir ekran kullanmıyor (profil ekranı için).
export const userService = {
  // GET /api/users/{id} → kullanıcı bilgileri
  getById: (id: number) => apiClient.get<User>(`${BASE_PATH}/${id}`),
  // PUT /api/users/{id} → kullanıcıyı güncelle; Partial<User> tüm alanların isteğe bağlı olduğu anlamına gelir
  update: (id: number, user: Partial<User>) => apiClient.put<User>(`${BASE_PATH}/${id}`, user),
};
