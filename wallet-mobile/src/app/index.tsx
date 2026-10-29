import { Redirect } from 'expo-router';

// Rota dosyası: "/" adresi, uygulama açılınca ilk gelinen yer.
// Kendi başına bir ekran çizmez; kullanıcıyı nereye göndereceğine karar verir.
// Şimdilik oturum kontrolü olmadığı için herkes giriş sayfasına gider.
// Login eklendiğinde burada "giriş yapılmışsa /home, yapılmamışsa /login" kararı verilecek.
export default function Index() {
  return <Redirect href="/login" />;
}
