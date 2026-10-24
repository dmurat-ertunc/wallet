import { Currency } from '@/models';

// Tutarı Türkçe para biçiminde yazar: 450.5, 'TRY' → "₺450,50"
// Intl.NumberFormat telefonun/tarayıcının yerleşik biçimlendiricisidir; para sembolünü ve ayırıcıları kendisi seçer.
export function formatCurrency(amount: number, currency: Currency = Currency.TRY): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount);
}

// "2026-10-20" -> "20.10.2026"
// slice(0, 10): değer saat de içeriyorsa ("2026-10-20T14:30:00") sadece tarih kısmını alır
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}.${month}.${year}`;
}

// Date -> "2026-10-20": backend'in LocalDate için beklediği biçim.
// Yerel saat kullanılır; toISOString() UTC'ye çevirdiği için gece yarısına yakın saatlerde tarihi bir gün kaydırabilirdi.
export function toIsoDate(date: Date): string {
  // getMonth() 0'dan başlar (Ocak = 0), bu yüzden +1; padStart tek haneli sayıların başına 0 ekler (5 → "05")
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
