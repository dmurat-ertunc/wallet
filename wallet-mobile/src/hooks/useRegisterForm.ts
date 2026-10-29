import { useState } from 'react';

import { useAuth } from '@/context';
import { ApiError } from '@/services';

// Kayıt formundaki alanlar. passwordConfirm sadece telefonda kontrol edilir, backend'e gönderilmez
export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

const EMPTY_FORM: RegisterFormValues = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

// Basit e-posta biçim kontrolü (bir @ ve noktalı bir alan adı); asıl kontrol backend'deki @Email
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Backend'in "zaten alınmış" hataları genel mesaj olarak gelir (bkz. AuthService.register);
// doğru alanın altında Türkçe gösterebilmek için mesajdan alana eşlenir
const DUPLICATE_ERRORS: Record<string, RegisterFormErrors> = {
  'Username is already taken': { userName: 'Bu kullanıcı adı alınmış' },
  'Email is already registered': { email: 'Bu e-posta ile kayıtlı bir hesap var' },
};

// Kurallar backend'deki RegisterRequest ile aynı; böylece kullanıcı hatayı istek gitmeden ve Türkçe görür
function validate(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const userName = values.userName.trim();
  const email = values.email.trim();

  if (!firstName) {
    errors.firstName = 'Ad zorunlu';
  } else if (firstName.length > 50) {
    errors.firstName = 'Ad en fazla 50 karakter olabilir';
  }

  if (!lastName) {
    errors.lastName = 'Soyad zorunlu';
  } else if (lastName.length > 50) {
    errors.lastName = 'Soyad en fazla 50 karakter olabilir';
  }

  if (!userName) {
    errors.userName = 'Kullanıcı adı zorunlu';
  } else if (userName.length < 3 || userName.length > 50) {
    errors.userName = 'Kullanıcı adı 3-50 karakter olmalı';
  }

  if (!email) {
    errors.email = 'E-posta zorunlu';
  } else if (!EMAIL_PATTERN.test(email) || email.length > 100) {
    errors.email = 'Geçerli bir e-posta gir';
  }

  if (values.password.length < 6) {
    errors.password = 'Şifre en az 6 karakter olmalı';
  } else if (values.password.length > 100) {
    errors.password = 'Şifre en fazla 100 karakter olabilir';
  }

  if (values.passwordConfirm !== values.password) {
    errors.passwordConfirm = 'Şifreler eşleşmiyor';
  }

  return errors;
}

// Kayıt formunun durumunu tutar ve AuthContext üzerinden backend'e gönderir; RegisterPage sadece bunu ekrana çizer.
// Kayıt başarılı olunca backend token da döndüğü için kullanıcı ayrıca giriş yapmaz;
// token dolunca kök layout'taki Stack.Protected onu ana sayfaya geçirir.
export function useRegisterForm() {
  const { signUp } = useAuth();
  const [values, setValues] = useState<RegisterFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  // Formun altında gösterilen genel hata (bağlantı hatası gibi bir alana ait olmayanlar)
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Tek bir alanı günceller ve o alanın hatasını siler (useExpenseForm'daki setField ile aynı)
  function setField<K extends keyof RegisterFormValues>(key: K, value: RegisterFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function submit() {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      // Baştaki/sondaki boşluklar atılır; şifreye dokunulmaz
      await signUp({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        userName: values.userName.trim(),
        email: values.email.trim(),
        password: values.password,
      });
    } catch (e) {
      const duplicate = e instanceof ApiError ? DUPLICATE_ERRORS[e.message] : undefined;
      if (duplicate) {
        setErrors(duplicate);
      } else if (e instanceof ApiError) {
        // Backend'in alan hataları (telefondaki kontrol aynı kuralları uyguladığı için nadiren gelir)
        setErrors(e.fieldErrors);
        setSubmitError(e.message);
      } else {
        setSubmitError('Kayıt yapılamadı');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return { values, errors, submitError, submitting, setField, submit };
}
