import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/context/FavoritesContext';

const categories = {
  tshirt: 'Tシャツ',
  hoodie: 'パーカー',
  cup: 'コップ',
  sticker: 'ステッカー',
  other: 'その他'
};

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
}

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  const { favorites, updateFavorites } = useFavorites();

  const handleFavoriteClick = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault(); // リンククリックを防ぐ

    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    setIsLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        const data = await response.json();
        updateFavorites(productId, data.isFavorite);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (!products.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            まだ商品がありません
          </h3>
          <p className="text-gray-500">
            このカテゴリーの商品は現在準備中です。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group bg-white rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 relative"
          >
            <div className="aspect-square relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {product.stock <= 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">
                    SOLD OUT
                  </span>
                </div>
              )}
              <button
                onClick={(e) => handleFavoriteClick(product.id, e)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  favorites.has(product.id) 
                    ? 'bg-black text-white' 
                    : 'bg-white/80 hover:bg-white text-gray-600'
                }`}
                disabled={isLoading[product.id]}
                aria-label={favorites.has(product.id) ? "お気に入りから削除" : "お気に入りに追加"}
              >
                <Heart 
                  className={`w-5 h-5 ${isLoading[product.id] ? 'opacity-50' : ''}`} 
                  fill={favorites.has(product.id) ? "currentColor" : "none"}
                />
              </button>
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isNew && (
                  <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                    新着
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                    おすすめ
                  </span>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-black">{product.name}</h3>
                <span className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-bold">
                  {categories[product.category as keyof typeof categories] || product.category}
                </span>
              </div>
              <p className="text-gray-500 mb-2 line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold text-black">¥{product.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}