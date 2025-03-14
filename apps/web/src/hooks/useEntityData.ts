import { useState, useEffect } from 'react';
import { useApi } from '@/providers/ApiProvider';

// Generic hook for fetching a list of entities
export function useEntityList<T>(
  apiSelector: (api: ReturnType<typeof useApi>) => { 
    getAll: () => Promise<T[]> 
  },
  dependencies: any[] = []
) {
  const api = useApi();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const entityApi = apiSelector(api);
        const result = await entityApi.getAll();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, ...dependencies]);

  return { data, loading, error, refetch: () => {} };
}

// Hook for fetching a single entity by ID
export function useEntityDetail<T>(
  apiSelector: (api: ReturnType<typeof useApi>) => { 
    getById: (id: string) => Promise<T> 
  },
  id: string,
  dependencies: any[] = []
) {
  const api = useApi();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const entityApi = apiSelector(api);
        const result = await entityApi.getById(id);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, id, ...dependencies]);

  return { data, loading, error, refetch: () => {} };
}