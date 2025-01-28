'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, updateFavorites } = useFavorites();
  const { incrementCartCount } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('商品の取得に失敗しました');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error: any) {
        console.error('Error:', error);
        setError(error.message);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if ((product.category === 'tshirt' || product.category === 'hoodie') && !selectedSize) {
      alert('サイズを選択してください');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          size: selectedSize || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'カートへの追加に失敗しました');
      }

      incrementCartCount(quantity);
      alert('カートに追加しました');
    } catch (error: any) {
      console.error('Cart error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if ((product.category === 'tshirt' || product.category === 'hoodie') && !selectedSize) {
      alert('サイズを選択してください');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          size: selectedSize || null,
        }),
      });

      if (!response.ok) {
        throw new Error('カートへの追加に失敗しました');
      }

      incrementCartCount(quantity);
      router.push('/checkout');
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: params.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      updateFavorites(parseInt(params.id), data.isFavorite);
    } catch (error: any) {
      console.error('Favorite error:', error);
      alert('お気に入りの更新に失敗しました');
    }
  };

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem-16rem)] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-4rem-16rem)] flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  const sizes = product.category === 'tshirt' 
    ? ['S', 'M', 'L', 'XL'] 
    : product.category === 'hoodie'
    ? ['M', 'L', 'XL', 'XXL']
    : [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            fill
            className="object-cover"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="bg-black text-white px-6 py-3 rounded-full text-lg font-black">
                SOLD OUT
              </span>
            </div>
          )}
          <button 
            onClick={handleToggleFavorite}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              favorites.has(parseInt(params.id))
                ? 'bg-black text-white'
                : 'bg-white/80 hover:bg-white text-gray-600'
            }`}
            aria-label={favorites.has(parseInt(params.id)) ? "お気に入りから削除" : "お気に入りに追加"}
          >
            <Heart 
              className="w-5 h-5" 
              fill={favorites.has(parseInt(params.id)) ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-black">{product.name}</h1>
          <p className="text-2xl font-bold text-black">¥{product.price.toLocaleString()}</p>
          <p className="text-gray-900 font-medium">{product.description}</p>

          {(product.category === 'tshirt' || product.category === 'hoodie') && (
            <div>
              <h3 className="text-base font-bold text-black mb-2">サイズ</h3>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full border-2 transition-colors font-medium
                      ${selectedSize === size 
                        ? 'bg-black text-white border-black' 
                        : 'border-gray-900 hover:bg-black hover:text-white'}`}
                    disabled={product.stock <= 0}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-base font-bold text-black mb-2">数量</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || product.stock <= 0}
                className="px-3 py-1 border-2 border-gray-900 rounded-md text-black font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
              >
                -
              </button>
              <span className="w-12 text-center font-bold text-black">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || product.stock <= 0}
                className="px-3 py-1 border-2 border-gray-900 rounded-md text-black font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0 || isLoading}
              className={`flex-1 px-8 py-3 rounded-full font-bold text-lg
                ${product.stock <= 0 || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:-translate-y-0.5 hover:shadow-lg transition-all'}`}
            >
              {product.stock <= 0 ? 'SOLD OUT' : isLoading ? '処理中...' : '今すぐ購入'}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isLoading}
              className={`flex-1 px-8 py-3 rounded-full font-bold text-lg
                ${product.stock <= 0 || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-black border-2 border-black hover:-translate-y-0.5 hover:shadow-lg transition-all'}`}
            >
              {product.stock <= 0 ? 'SOLD OUT' : isLoading ? '処理中...' : 'カートに追加'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}