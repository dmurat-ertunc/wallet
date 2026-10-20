import { useCallback, useEffect, useState } from 'react';

import { Expense } from '@/models';
import { expenseService } from '@/services';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Incrementing this re-runs the effect below and refetches the list
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Ignores the response if the component unmounted or a newer request started
    let ignore = false;

    expenseService
      .getAll()
      .then((data) => {
        if (!ignore) {
          setExpenses(data);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!ignore) {
          setError(e instanceof Error ? e.message : 'Harcamalar yüklenemedi');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const refresh = useCallback(() => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return { expenses, loading, error, refresh };
}
