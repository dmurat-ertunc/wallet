import { createContext, type PropsWithChildren, use, useCallback, useEffect, useState } from 'react';

import { LoginRequest, RegisterRequest } from '@/models';
import { authService, setAuthToken, setUnauthorizedHandler, tokenStorage } from '@/services';

type AuthContextValue = {
  // Oturum açıksa JWT, değilse null
  token: string | null;
  // Açılışta kayıtlı token telefondan okunurken true; bu sürede splash ekranı açık kalır
  isLoading: boolean;
  // Backend'e giriş isteği atar; başarılıysa token'ı saklar. Başarısızsa ApiError fırlatır (ekran mesajı gösterir)
  signIn: (request: LoginRequest) => Promise<void>;
  // Yeni hesap açar ve aynı anda oturumu başlatır. Başarısızsa ApiError fırlatır
  signUp: (request: RegisterRequest) => Promise<void>;
  // Token'ı siler; korumalı ekranlar kapanır ve kullanıcı giriş ekranına döner
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
// Token üç yerde tutulur: ekranlar için state'te, istekler için apiClient'ta, kalıcılık için tokenStorage'da.
// Aşağıdaki fonksiyonlar üçünü her zaman birlikte günceller.
export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setToken(null);
    await tokenStorage.remove();
  }, []);

  // Giriş ve kayıt aynı şekilde biter: backend'den gelen token saklanır ve oturum açılır
  const startSession = useCallback(async (newToken: string) => {
    await tokenStorage.set(newToken);
    setAuthToken(newToken);
    setToken(newToken);
  }, []);

  const signIn = useCallback(
    async (request: LoginRequest) => {
      const response = await authService.login(request);
      await startSession(response.token);
    },
    [startSession],
  );

  const signUp = useCallback(
    async (request: RegisterRequest) => {
      const response = await authService.register(request);
      await startSession(response.token);
    },
    [startSession],
  );

  // Açılışta: daha önce giriş yapılmışsa token telefonda duruyordur, tekrar giriş istenmez.
  // Süresi dolmuşsa ilk istek 401 döner ve aşağıdaki handler oturumu kapatır.
  useEffect(() => {
    tokenStorage
      .get()
      .then((stored) => {
        setAuthToken(stored);
        setToken(stored);
      })
      // Okunamazsa giriş yapılmamış sayılır
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, []);

  // apiClient token'lı bir istekte 401 alınca oturumu kapatsın
  useEffect(() => {
    setUnauthorizedHandler(() => {
      void signOut();
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  return <AuthContext value={{ token, isLoading, signIn, signUp, signOut }}>{children}</AuthContext>;
}
