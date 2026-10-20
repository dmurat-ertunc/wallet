import { Currency, ExpenseCategory, PaymentMethod, RecurrencePeriod } from './enums';

// Mirrors com.fin.wallet.entity.Expense; dates arrive from the API as ISO strings
export interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  currency: Currency;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  expenseDate: string;
  merchant?: string;
  location?: string;
  receiptUrl?: string;
  recurring: boolean;
  recurrencePeriod?: RecurrencePeriod;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Body sent when creating or updating an expense
export type ExpenseRequest = Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
