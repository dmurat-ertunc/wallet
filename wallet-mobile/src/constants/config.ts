import Constants from 'expo-constants';

// Backend'in (Spring Boot) çalıştığı port
const API_PORT = 8080;

// Backend adresini belirler.
// 1) .env dosyasında EXPO_PUBLIC_API_URL tanımlıysa o kullanılır (ör. tunnel modunda veya uzak sunucuda).
// 2) Tanımlı değilse: geliştirme sırasında telefon Metro'ya zaten bilgisayarın ağ IP'si üzerinden bağlanıyor
//    (hostUri, ör. "192.168.1.20:8081"). Backend de aynı bilgisayarda çalıştığı için aynı IP kullanılır.
//    Telefonda "localhost" telefonun kendisi demek olduğundan bu gerekli; web'de hostUri zaten localhost'tur.
function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // "192.168.1.20:8081" → "192.168.1.20"; hostUri yoksa localhost
  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
  return `http://${host}:${API_PORT}/api`;
}

// Tüm isteklerin başına eklenen adres, ör. http://192.168.1.20:8080/api
export const API_BASE_URL = resolveApiBaseUrl();

// Bir isteğin en fazla bekleneceği süre (milisaniye); dolarsa "Sunucu yanıt vermedi" hatası verilir
export const REQUEST_TIMEOUT_MS = 15000;
