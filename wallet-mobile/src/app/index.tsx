import { Redirect } from 'expo-router';

import { useAuth } from '@/context';

// Rota dosyası: "/" adresi, uygulama açılınca ilk gelinen yer.
// Kendi başına bir ekran çizmez; kullanıcıyı oturuma göre yönlendirir.
// Korumalı bir ekranın kilidi kapanınca (giriş veya çıkış) Stack.Protected kullanıcıyı da buraya gönderir.
export default function Index() {
  const { token } = useAuth();
  return <Redirect href={token ? '/home' : '/login'} />;
}
