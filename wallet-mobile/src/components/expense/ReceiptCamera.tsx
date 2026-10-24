import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppText } from '@/components/common';
import { Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

type ReceiptCameraProps = {
  // Çekilmiş fotoğrafın adresi; null ise henüz fotoğraf yok ve kamera gösterilir
  photoUri: string | null;
  // Fotoğraf çekilince adresiyle birlikte çağrılır
  onCapture: (uri: string) => void;
  // "Tekrar çek"e basılınca çağrılır
  onRetake: () => void;
};

// Fiş fotoğrafı çekme alanı: kamera izni ister, canlı kamera görüntüsünü gösterir ve fotoğraf çeker.
// Fotoğraf çekilince kamera yerine fotoğraf gösterilir; aynı anda yalnızca bir kamera açık olabildiği için bu önemli.
export function ReceiptCamera({ photoUri, onCapture, onRetake }: ReceiptCameraProps) {
  const theme = useTheme();
  // permission: izin durumu (null ise henüz okunuyor), requestPermission: kullanıcıdan izin iste
  const [permission, requestPermission] = useCameraPermissions();
  // Kamera bileşenine doğrudan erişim; fotoğraf çekmek için takePictureAsync'i bunun üzerinden çağırıyoruz
  const cameraRef = useRef<CameraView>(null);
  // Kamera hazır olduğunu bildirmeden takePictureAsync çağrılmamalı
  const [ready, setReady] = useState(false);
  // Fotoğraf çekiliyor mu; çekim sırasında butona tekrar basılmasın
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. durum: fotoğraf zaten çekilmiş → fotoğrafı ve "Tekrar çek" butonunu göster
  if (photoUri) {
    return (
      <View style={styles.container}>
        {/* contentFit="contain": fotoğraf kırpılmadan alana sığdırılır */}
        <Image source={{ uri: photoUri }} style={styles.preview} contentFit="contain" />
        <AppButton title="Tekrar çek" onPress={onRetake} />
      </View>
    );
  }

  // 2. durum: izin durumu henüz okunuyor
  if (!permission) {
    return <ActivityIndicator style={styles.center} />;
  }

  // 3. durum: izin yok → açıklama ve izin isteme butonu
  if (!permission.granted) {
    return (
      <View style={[styles.center, styles.permission]}>
        <AppText style={styles.centerText}>Fişin fotoğrafını çekebilmek için kamera izni gerekiyor.</AppText>
        {/* canAskAgain false ise kullanıcı izni kalıcı olarak reddetmiştir; uygulama artık soramaz */}
        {permission.canAskAgain ? (
          <AppButton title="Kameraya izin ver" onPress={requestPermission} />
        ) : (
          <AppText color="textSecondary" style={styles.centerText}>
            İzin daha önce reddedildi. Telefonun ayarlarından uygulamaya kamera izni verebilirsin.
          </AppText>
        )}
      </View>
    );
  }

  // Deklanşöre basılınca çalışır
  async function takePicture() {
    // Kamera hazır değilse veya zaten çekim yapılıyorsa hiçbir şey yapma
    if (!cameraRef.current || !ready || capturing) {
      return;
    }
    setCapturing(true);
    setError(null);
    try {
      // quality: 0.7 → dosya boyutunu küçültmek için biraz sıkıştırılmış fotoğraf
      const picture = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      onCapture(picture.uri);
    } catch {
      setError('Fotoğraf çekilemedi, tekrar deneyin');
    } finally {
      // Başarılı da olsa hata da olsa çekim bitti
      setCapturing(false);
    }
  }

  // 4. durum: izin var → canlı kamera görüntüsü ve deklanşör
  return (
    <View style={styles.container}>
      <View style={[styles.cameraFrame, { backgroundColor: theme.surface }]}>
        {/* absoluteFill: kamera görüntüsü çerçevenin tamamını kaplar; facing="back" arka kamera */}
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" onCameraReady={() => setReady(true)} />
      </View>
      {error ? (
        <AppText color="danger" style={styles.centerText}>
          {error}
        </AppText>
      ) : null}
      {/* Yuvarlak deklanşör butonu; kamera hazır değilken veya çekim sürerken soluk ve basılamaz */}
      <Pressable
        onPress={takePicture}
        disabled={!ready || capturing}
        accessibilityRole="button"
        accessibilityLabel="Fotoğraf çek"
        style={[styles.shutter, { borderColor: theme.primary, opacity: ready && !capturing ? 1 : 0.5 }]}>
        {capturing ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <View style={[styles.shutterInner, { backgroundColor: theme.primary }]} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: Spacing.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  permission: { gap: Spacing.md, paddingHorizontal: Spacing.md },
  centerText: { textAlign: 'center' },
  // overflow: 'hidden' → kamera görüntüsü yuvarlak köşelerin dışına taşmasın
  cameraFrame: { flex: 1, borderRadius: Radius.md, overflow: 'hidden' },
  preview: { flex: 1, borderRadius: Radius.md },
  // Dış halka: 72 piksel çaplı çerçeveli daire (borderRadius = genişliğin yarısı)
  shutter: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // İç dolu daire
  shutterInner: { width: 54, height: 54, borderRadius: 27 },
});
