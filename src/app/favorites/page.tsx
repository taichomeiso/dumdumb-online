'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useFavorites } from '@/context/FavoritesContext';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  isNew: boolean;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { status } = useSession();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { decrementFavoritesCount } = useFavorites();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.map((favorite: any) => favorite.product));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status, router]);

  const handleRemoveFavorite = async (productId: number) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setFavorites(prevFavorites => 
          prevFavorites.filter(product => product.id !== productId)
        );
        decrementFavoritesCount();
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem-16rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem-16rem)] bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-8">お気に入り商品</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-6">お気に入りの商品がありません</p>
            <Link 
              href="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-lg font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              商品を探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((product) => (
              <div key={product.id} className="border-2 border-black rounded-xl overflow-hidden relative">
                <Link href={`/products/${product.id}`} className="block relative aspect-square">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="bg-black text-white px-6 py-3 rounded-full text-xl font-black">
                        SOLD OUT
                      </span>
                    </div>
                  )}
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-black text-white px-4 py-2 rounded-full font-bold">
                      NEW
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFavorite(product.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black text-white transition-colors hover:bg-gray-900"
                    aria-label="お気に入りから削除"
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                  </button>
                </Link>

                <div className="p-4">
                  <div>
                    <h3 className="text-lg font-bold text-black mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xl font-black text-black">
                      ¥{product.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <p className={`font-medium mt-2 ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.stock > 0 ? '在庫あり' : '在庫なし'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}