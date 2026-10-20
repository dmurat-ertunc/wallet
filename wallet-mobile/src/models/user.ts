import { Currency } from './enums';

// Mirrors com.fin.wallet.entity.User (password is never sent to the client)
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  defaultCurrency: Currency;
  monthlyBudget?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
