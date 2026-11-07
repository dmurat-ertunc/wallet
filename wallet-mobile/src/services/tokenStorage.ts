import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Token'ların saklandığı anahtarların adı (SecureStore sadece harf, rakam, ".", "-" ve "_" kabul eder).
// Access token eski sürümdeki tek token'ın anahtarını kullanır; böylece eski kurulumlarda arkada artık değer kalmaz.
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

// Oturumu oluşturan iki token; ikisi her zaman birlikte saklanır ve birlikte silinir
export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
};

// iOS/Android: SecureStore → işletim sisteminin kasası (Keychain / Keystore), şifreli saklanır.
// Web: SecureStore çalışmaz, localStorage kullanılır. Sayfadaki her JavaScript okuyabildiği için daha az güvenli;
// web asıl hedef olmadığı için bilinçli bir taviz. Web ciddi bir ürüne dönüşürse httpOnly cookie'ye geçilmeli.
// localStorage gizli sekmede veya sunucu tarafında (SSR) erişilemez olabilir; bu yüzden hatalar yutulur.
async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Saklanamazsa oturum sadece bu açılış boyunca sürer
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch {
      // Zaten erişilemiyorsa silinecek bir şey de yok
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

// Token'ların telefonda nerede tutulduğuna karar veren tek yer; uygulamanın geri kalanı sadece bu üç fonksiyonu bilir.
export const tokenStorage = {
  // İki token'dan biri eksikse oturum yok sayılır. Refresh token'dan önceki sürümden kalan
  // tek başına bir access token da buraya düşer: kullanıcı bir kez yeniden giriş yapar.
  async get(): Promise<StoredTokens | null> {
    const [accessToken, refreshToken] = await Promise.all([getItem(ACCESS_TOKEN_KEY), getItem(REFRESH_TOKEN_KEY)]);
    if (!accessToken || !refreshToken) {
      return null;
    }
    return { accessToken, refreshToken };
  },

  async set(tokens: StoredTokens): Promise<void> {
    await Promise.all([
      setItem(ACCESS_TOKEN_KEY, tokens.accessToken),
      setItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
    ]);
  },

  async remove(): Promise<void> {
    await Promise.all([removeItem(ACCESS_TOKEN_KEY), removeItem(REFRESH_TOKEN_KEY)]);
  },
};
