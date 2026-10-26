import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { Expense } from '@/models';
import { expenseService } from '@/services';
import { Alert } from 'react-native';


// Harcama listesini backend'den çeker ve ekranın ihtiyaç duyduğu durumu döndürür.
// Kullanan sayfa sadece bu değerlere bakarak ne çizeceğine karar verir.
export function useExpenses() {
  // Backend'den gelen harcamalar; başta boş liste
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // İstek sürüyor mu; ilk açılışta hemen istek atılacağı için true başlar
  const [loading, setLoading] = useState(true);
  // Hata mesajı; hata yoksa null
  const [error, setError] = useState<string | null>(null);
  // Bu sayı her artırıldığında aşağıdaki effect yeniden çalışır ve liste tekrar çekilir
  const [reloadKey, setReloadKey] = useState(0);
  // Silme başarısız olursa listenin üstünde gösterilen mesaj; listeyi gizlememek için error'dan ayrı tutuluyor
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Ekran her öne geldiğinde çalışır (ilk açılış, formdan geri dönüş, başka sekmeden geçiş).
  // useEffect sadece ilk oluşturulmada çalışırdı; sekmeler ekranı arka planda canlı tuttuğu için yeni kayıt görünmezdi.
  useFocusEffect(
    // useCallback: fonksiyon sadece reloadKey değişince yeniden oluşturulur; aksi halde her çizimde istek atılırdı
    useCallback(() => {
      // Ekrandan çıkıldıysa veya daha yeni bir istek başladıysa, geç gelen eski cevap yok sayılır
      let ignore = false;

      expenseService
        .getAll()
        // Başarılı: listeyi kaydet, varsa eski hatayı temizle
        .then((data) => {
          if (!ignore) {
            setExpenses(data);
            setError(null);
          }
        })
        // Başarısız: hata mesajını kaydet (ApiError zaten Türkçe mesaj taşır)
        .catch((e: unknown) => {
          if (!ignore) {
            setError(e instanceof Error ? e.message : 'Harcamalar yüklenemedi');
          }
        })
        // Her iki durumda da yükleme bitti
        .finally(() => {
          if (!ignore) {
            setLoading(false);
          }
        });

      // Temizleme (cleanup) fonksiyonu: ekran odağı kaybedince veya effect yeniden çalışmadan önce çağrılır
      return () => {
        ignore = true;
      };
      // reloadKey içeride okunmuyor; sadece refresh() yeniden çekim tetiklesin diye bağımlılıklarda yer alıyor
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]),
  );

  // Listeyi elle yenile (aşağı çekince veya "Tekrar dene"ye basınca)
  const refresh = useCallback(() => {
    setLoading(true);
    // Fonksiyon biçimi her zaman en güncel değeri kullanır: key => key + 1
    setReloadKey((key) => key + 1);
  }, []);

  // Harcamayı backend'den siler; başarılıysa listeden de çıkarır.
  // Silindiyse true, silinemediyse false döner; böylece kart başarısızlıkta kendini eski haline getirebilir.
  const deleteExpense = useCallback(async (id: number) => {
    setDeleteError(null);
    try {
      // DELETE /api/expenses/{id} → başarılıysa 204 No Content
      await expenseService.remove(id);
      // Listeyi baştan çekmek yerine silinen kaydı yerel listeden çıkar; ekran anında güncellenir
      setExpenses((current) => current.filter((expense) => expense.id !== id));
      return true;
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Harcama silinemedi');
      return false;
    }
  }, []);


  const editExpense = useCallback(async (id: number) => {
    setDeleteError(null);
    try {
      console.log("güncellendi")
      return true;
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Harcama silinemedi');
      return false;
    }
  }, []);

  return { expenses, loading, error, refresh, deleteExpense, editExpense, deleteError };
}
