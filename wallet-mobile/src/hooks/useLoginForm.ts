import { useState } from 'react';

import { useAuth } from '@/context';
import { ApiError } from '@/services';

// Giriş formundaki alanlar için hata mesajları
type LoginFormErrors = { userName?: string; password?: string };

// Giriş formunun durumunu tutar ve AuthContext üzerinden backend'e gönderir; LoginPage sadece bunu ekrana çizer.
// Başarılı girişten sonra yönlendirme yapılmaz: token dolunca kök layout'taki Stack.Protected kullanıcıyı kendisi ana sayfaya geçirir.
export function useLoginForm() {
  const { signIn } = useAuth();
  const [userName, setUserNameValue] = useState('');
  const [password, setPasswordValue] = useState('');
  // Alan bazında hatalar (boş bırakıldıysa)
  const [errors, setErrors] = useState<LoginFormErrors>({});
  // Formun altında gösterilen genel hata (yanlış şifre, sunucuya ulaşılamadı...)
  const [submitError, setSubmitError] = useState<string | null>(null);
  // İstek sürüyor mu; true iken buton dönen simge gösterir ve basılamaz
  const [submitting, setSubmitting] = useState(false);

  // Kullanıcı yazmaya başlayınca o alanın kırmızı mesajı kaybolsun
  function setUserName(value: string) {
    setUserNameValue(value);
    setErrors((current) => ({ ...current, userName: undefined }));
  }

  function setPassword(value: string) {
    setPasswordValue(value);
    setErrors((current) => ({ ...current, password: undefined }));
  }

  async function submit() {
    // 1. Önce telefonda kontrol et; boş alan varsa backend'e hiç istek gitmez
    const validationErrors: LoginFormErrors = {};
    if (!userName.trim()) {
      validationErrors.userName = 'Kullanıcı adı zorunlu';
    }
    if (!password) {
      validationErrors.password = 'Şifre zorunlu';
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      // Kullanıcı adının başına/sonuna yanlışlıkla eklenen boşluklar atılır; şifreye dokunulmaz
      await signIn({ userName: userName.trim(), password });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        // Backend hangisinin yanlış olduğunu bilerek söylemez, biz de söylemeyiz
        setSubmitError('Kullanıcı adı veya şifre hatalı');
      } else {
        setSubmitError(e instanceof Error ? e.message : 'Giriş yapılamadı');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return { userName, password, errors, submitError, submitting, setUserName, setPassword, submit };
}
