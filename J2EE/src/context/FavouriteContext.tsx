import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../components/Auth/AuthContext';
import type { CatalogItem } from '../api/productApi';
import {
  addFavouriteApi,
  getMyFavourites,
  removeFavouriteApi,
} from '../api/favouriteApi';

interface FavouriteContextType {
  favourites: CatalogItem[];
  totalFavourites: number;
  loading: boolean;
  error: string;
  refreshFavourites: (signal?: AbortSignal) => Promise<void>;
  isFavourite: (productId: string | number) => boolean;
  addFavourite: (productId: string | number) => Promise<void>;
  removeFavourite: (productId: string | number) => Promise<void>;
  toggleFavourite: (productId: string | number) => Promise<boolean>;
}

const FavouriteContext = createContext<FavouriteContextType | undefined>(
  undefined
);

export const FavouriteProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, token } = useAuth();
  const [favourites, setFavourites] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const refreshFavourites = useCallback(
    async (signal?: AbortSignal) => {
      if (!isAuthenticated || !token) {
        setFavourites([]);
        setError('');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const items = await getMyFavourites(signal);
        if (!signal?.aborted) {
          setFavourites(items);
        }
      } catch (err) {
        if (!signal?.aborted) {
          console.error('Lỗi tải danh sách yêu thích:', err);
          setError(
            err instanceof Error
              ? err.message
              : 'Không thể tải danh sách yêu thích'
          );
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [isAuthenticated, token]
  );

  useEffect(() => {
    const controller = new AbortController();
    refreshFavourites(controller.signal).catch(console.error);
    return () => controller.abort();
  }, [refreshFavourites]);

  const favouriteIds = useMemo(
    () => new Set(favourites.map((item) => String(item.product.id))),
    [favourites]
  );

  const isFavourite = useCallback(
    (productId: string | number) => favouriteIds.has(String(productId)),
    [favouriteIds]
  );

  const addFavourite = useCallback(async (productId: string | number) => {
    const addedItem = await addFavouriteApi(productId);
    setFavourites((prev) =>
      prev.some((item) => item.product.id === addedItem.product.id)
        ? prev
        : [addedItem, ...prev]
    );
  }, []);

  const removeFavourite = useCallback(async (productId: string | number) => {
    const normalizedId = String(productId);
    await removeFavouriteApi(normalizedId);
    setFavourites((prev) =>
      prev.filter((item) => item.product.id !== normalizedId)
    );
  }, []);

  const toggleFavourite = useCallback(
    async (productId: string | number): Promise<boolean> => {
      const normalizedId = String(productId);
      if (favouriteIds.has(normalizedId)) {
        await removeFavourite(normalizedId);
        return false;
      }
      await addFavourite(normalizedId);
      return true;
    },
    [favouriteIds, addFavourite, removeFavourite]
  );

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        totalFavourites: favourites.length,
        loading,
        error,
        refreshFavourites,
        isFavourite,
        addFavourite,
        removeFavourite,
        toggleFavourite,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourite = () => {
  const context = useContext(FavouriteContext);
  if (!context) {
    throw new Error(
      'useFavourite phải được sử dụng bên trong FavouriteProvider'
    );
  }
  return context;
};
