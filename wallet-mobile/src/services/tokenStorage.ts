import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Token'ın saklandığı anahtarın adı (SecureStore sadece harf, rakam, ".", "-" ve "_" kabul eder)
const TOKEN_KEY = 'auth_token';

// JWT'nin telefonda nerede tutulduğuna karar veren tek yer; uygulamanın geri kalanı sadece bu üç fonksiyonu bilir.
// iOS/Android: SecureStore → işletim sisteminin kasası (Keychain / Keystore), şifreli saklanır.
// Web: SecureStore çalışmaz, localStorage kullanılır. Sayfadaki her JavaScript okuyabildiği için daha az güvenli;
// web asıl hedef olmadığı için bilinçli bir taviz. Web ciddi bir ürüne dönüşürse httpOnly cookie'ye geçilmeli.
// localStorage gizli sekmede veya sunucu tarafında (SSR) erişilemez olabilir; bu yüzden hatalar yutulur.
export const tokenStorage = {
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return typeof localStorage === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
      } catch {
        return null;
      }
    }
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async set(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(TOKEN_KEY, token);
      } catch {
        // Saklanamazsa oturum sadece bu açılış boyunca sürer
      }
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async remove(): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        // Zaten erişilemiyorsa silinecek bir şey de yok
      }
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
