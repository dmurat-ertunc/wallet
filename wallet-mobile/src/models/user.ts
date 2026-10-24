import { Currency } from './enums';

// Backend'deki com.fin.wallet.entity.User'ın aynası.
// Şifre alanı bilerek yok: şifre hiçbir zaman istemciye gönderilmez.
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // "?" alanın isteğe bağlı olduğunu gösterir
  phoneNumber?: string;
  // Kullanıcının varsayılan para birimi (veritabanında varsayılan TRY)
  defaultCurrency: Currency;
  // Aylık bütçe; tanımlanmamış olabilir
  monthlyBudget?: number;
  // Hesap aktif mi
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
