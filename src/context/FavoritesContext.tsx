import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface FavoritesContextType {
  favoritesCount: number;
  setFavoritesCount: (count: number) => void;
  favorites: Set<number>;
  updateFavorites: (productId: number, isFavorite: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const { status } = useSession();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/favorites');
          if (response.ok) {
            const data = await response.json();
            const favoriteIds = new Set(data.map((favorite: any) => favorite.productId));
            setFavorites(favoriteIds);
            setFavoritesCount(data.length);
          }
        } catch (error) {
          console.error('Error fetching favorites count:', error);
        }
      }
    };

    fetchFavorites();
  }, [status]);

  const updateFavorites = (productId: number, isFavorite: boolean) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (isFavorite) {
        newFavorites.add(productId);
        setFavoritesCount(prev => prev + 1);
      } else {
        newFavorites.delete(productId);
        setFavoritesCount(prev => prev - 1);
      }
      return newFavorites;
    });
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favoritesCount, 
        setFavoritesCount,
        favorites,
        updateFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}