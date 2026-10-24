// Backend'deki enum'ların aynısı: wallet-be → com.fin.wallet.entity.enums
// Değerler İngilizce ve büyük harflidir çünkü backend bunları böyle bekler.
// Ekranda görünen Türkçe karşılıklar constants/labels.ts içindedir.

// Para birimleri
export enum Currency {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

// Harcama kategorileri
export enum ExpenseCategory {
  FOOD = 'FOOD',
  GROCERIES = 'GROCERIES',
  TRANSPORTATION = 'TRANSPORTATION',
  HOUSING = 'HOUSING',
  UTILITIES = 'UTILITIES',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SHOPPING = 'SHOPPING',
  CLOTHING = 'CLOTHING',
  TRAVEL = 'TRAVEL',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  PERSONAL_CARE = 'PERSONAL_CARE',
  GIFTS = 'GIFTS',
  INSURANCE = 'INSURANCE',
  TAXES = 'TAXES',
  OTHER = 'OTHER',
}

// Ödeme yöntemleri
export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  OTHER = 'OTHER',
}
