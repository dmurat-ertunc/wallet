import { createContext, type PropsWithChildren, use, useCallback, useEffect, useRef, useState } from 'react';

import { LoginRequest, RegisterRequest } from '@/models';
import {
  ApiError,
  authService,
  setAuthToken,
  setTokenRefresher,
  setUnauthorizedHandler,
  type StoredTokens,
  tokenStorage,
} from '@/services';

type AuthContextValue = {
  // Oturum açıksa access token (JWT), değilse null
  token: string | null;
  // Açılışta kayıtlı token'lar telefondan okunurken true; bu sürede splash ekranı açık kalır
  isLoading: boolean;
  // Backend'e giriş isteği atar; başarılıysa token'ları saklar. Başarısızsa ApiError fırlatır (ekran mesajı gösterir)
  signIn: (request: LoginRequest) => Promise<void>;
  // Yeni hesap açar ve aynı anda oturumu başlatır. Başarısızsa ApiError fırlatır
  signUp: (request: RegisterRequest) => Promise<void>;
  // Token'ları siler ve backend'deki oturumu kapatır; korumalı ekranlar kapanır ve kullanıcı giriş ekranına döner
  signOut: () => Promise<void>;
};

// Oturum bilgisinin uygulamanın her yerinden okunabildiği ortak kutu (Context)
const AuthContext = createContext<AuthContextValue | null>(null);

// Oturum bilgisine erişmek için: const { token, signIn, signOut } = useAuth();
export function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return value;
}

// Kök layout'ta tüm uygulamayı sarar ve oturum durumunu yönetir.
// Access token üç yerde tutulur: ekranlar için state'te, istekler için apiClient'ta, kalıcılık için tokenStorage'da.
// Refresh token ekranlara gerekmez; bellekte ref'te ve tokenStorage'da durur.
// Aşağıdaki fonksiyonlar hepsini her zaman birlikte günceller.
export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // State değil ref: sadece yenileme ve çıkışta okunur, değişmesi ekranların yeniden çizilmesini gerektirmez
  const refreshTokenRef = useRef<string | null>(null);

  // Telefondaki oturumu temizler, backend'e gitmez
  const clearSession = useCallback(async () => {
    refreshTokenRef.current = null;
    setAuthToken(null);
    setToken(null);
    await tokenStorage.remove();
  }, []);

  // Giriş, kayıt ve yenileme aynı şekilde biter: backend'den gelen token'lar saklanır ve oturum açılır.
  // Önce kalıcı depoya yazılır: uygulama tam bu sırada kapanırsa bir sonraki açılışta yeni token'lar kullanılsın
  const startSession = useCallback(async (tokens: StoredTokens) => {
    await tokenStorage.set(tokens);
    refreshTokenRef.current = tokens.refreshToken;
    setAuthToken(tokens.accessToken);
    setToken(tokens.accessToken);
  }, []);

  // Önce telefonda kapatılır: kullanıcı beklemez, internet yokken de çıkış yapılabilir.
  // Ardından backend'deki refresh token iptal edilir; bu başarısız olursa token 30 gün sonra kendiliğinden geçersizleşir
  const signOut = useCallback(async () => {
    const refreshToken = refreshTokenRef.current;
    await clearSession();
    if (refreshToken) {
      authService.logout({ refreshToken }).catch(() => undefined);
    }
  }, [clearSession]);

  const signIn = useCallback(
    async (request: LoginRequest) => {
      await startSession(await authService.login(request));
    },
    [startSession],
  );

  const signUp = useCallback(
    async (request: RegisterRequest) => {
      await startSession(await authService.register(request));
    },
    [startSession],
  );

  // apiClient, access token'ı reddedilen bir istekte bunu çağırır (aynı anda gelen 401'ler için tek sefer).
  // Yeni access token'ı döner; refresh token da geçersizse null döner ve apiClient oturumu kapatır.
  const refreshSession = useCallback(async (): Promise<string | null> => {
    const refreshToken = refreshTokenRef.current;
    if (!refreshToken) {
      return null;
    }
    try {
      const tokens = await authService.refresh({ refreshToken });
      // Yenileme sürerken çıkış yapıldıysa gelen token'lar kullanılmaz; yoksa kapatılan oturum geri açılırdı
      if (refreshTokenRef.current !== refreshToken) {
        return null;
      }
      await startSession(tokens);
      return tokens.accessToken;
    } catch (e) {
      // 401: refresh token'ın süresi dolmuş veya iptal edilmiş, oturum kurtarılamaz
      if (e instanceof ApiError && e.status === 401) {
        return null;
      }
      // İnternet yok veya sunucu hatası: oturum kapatılmaz, istek hata olarak döner ve kullanıcı tekrar deneyebilir
      throw e;
    }
  }, [startSession]);

  // Açılışta: daha önce giriş yapılmışsa token'lar telefonda duruyordur, tekrar giriş istenmez.
  // Access token'ın süresi dolmuşsa ilk istek 401 alır ve apiClient refresh token ile sessizce yeniler.
  useEffect(() => {
    tokenStorage
      .get()
      .then((stored) => {
        refreshTokenRef.current = stored?.refreshToken ?? null;
        setAuthToken(stored?.accessToken ?? null);
        setToken(stored?.accessToken ?? null);
      })
      // Okunamazsa giriş yapılmamış sayılır
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, []);

  // apiClient'a token yenilemeyi ve kurtarılamayan oturumu kapatmayı öğret.
  // Oturum kapatılırken backend'e logout atılmaz: refresh token zaten geçersiz
  useEffect(() => {
    setTokenRefresher(refreshSession);
    setUnauthorizedHandler(() => {
      void clearSession();
    });
    return () => {
      setTokenRefresher(null);
      setUnauthorizedHandler(null);
    };
  }, [refreshSession, clearSession]);

  return <AuthContext value={{ token, isLoading, signIn, signUp, signOut }}>{children}</AuthContext>;
}
