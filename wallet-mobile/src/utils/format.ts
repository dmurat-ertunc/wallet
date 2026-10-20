import { Currency } from '@/models';

export function formatCurrency(amount: number, currency: Currency = Currency.TRY): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount);
}

// "2026-10-20" -> "20.10.2026"
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}.${month}.${year}`;
}

// Date -> "2026-10-20", the format the backend expects for LocalDate
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
