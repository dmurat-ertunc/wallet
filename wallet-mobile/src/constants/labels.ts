import { ExpenseCategory, PaymentMethod, RecurrencePeriod } from '@/models';

// Turkish display names for enum values shown in the UI

export const CategoryLabels: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: 'Yemek',
  [ExpenseCategory.GROCERIES]: 'Market',
  [ExpenseCategory.TRANSPORTATION]: 'Ulaşım',
  [ExpenseCategory.HOUSING]: 'Kira / Konut',
  [ExpenseCategory.UTILITIES]: 'Faturalar',
  [ExpenseCategory.HEALTH]: 'Sağlık',
  [ExpenseCategory.EDUCATION]: 'Eğitim',
  [ExpenseCategory.ENTERTAINMENT]: 'Eğlence',
  [ExpenseCategory.SHOPPING]: 'Alışveriş',
  [ExpenseCategory.CLOTHING]: 'Giyim',
  [ExpenseCategory.TRAVEL]: 'Seyahat',
  [ExpenseCategory.SUBSCRIPTIONS]: 'Abonelikler',
  [ExpenseCategory.PERSONAL_CARE]: 'Kişisel Bakım',
  [ExpenseCategory.GIFTS]: 'Hediyeler',
  [ExpenseCategory.INSURANCE]: 'Sigorta',
  [ExpenseCategory.TAXES]: 'Vergiler',
  [ExpenseCategory.OTHER]: 'Diğer',
};

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Nakit',
  [PaymentMethod.CREDIT_CARD]: 'Kredi Kartı',
  [PaymentMethod.DEBIT_CARD]: 'Banka Kartı',
  [PaymentMethod.BANK_TRANSFER]: 'Havale / EFT',
  [PaymentMethod.MOBILE_PAYMENT]: 'Mobil Ödeme',
  [PaymentMethod.OTHER]: 'Diğer',
};

export const RecurrencePeriodLabels: Record<RecurrencePeriod, string> = {
  [RecurrencePeriod.DAILY]: 'Günlük',
  [RecurrencePeriod.WEEKLY]: 'Haftalık',
  [RecurrencePeriod.MONTHLY]: 'Aylık',
  [RecurrencePeriod.YEARLY]: 'Yıllık',
};
