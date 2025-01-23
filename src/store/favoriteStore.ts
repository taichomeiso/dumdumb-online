import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteStore {
  favorites: number[]
  favoritesCount: number
  addFavorite: (productId: number) => void
  removeFavorite: (productId: number) => void
  isFavorite: (productId: number) => boolean
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      favoritesCount: 0,
      addFavorite: (productId) =>
        set((state) => ({
          favorites: [...state.favorites, productId],
          favoritesCount: state.favoritesCount + 1,
        })),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
          favoritesCount: state.favoritesCount - 1,
        })),
      isFavorite: (productId) => get().favorites.includes(productId),
    }),
    {
      name: 'favorites-storage',
    }
  )
)