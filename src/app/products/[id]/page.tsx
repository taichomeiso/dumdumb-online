'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('商品の取得に失敗しました');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError('商品の取得に失敗しました');
        console.error('Error:', error);
      }
    };

    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const cart = await response.json();
          setCartItemsCount(cart.length);
        }
      } catch (error) {
        console.error('カート数の取得エラー:', error);
      }
    };

    fetchProduct();
    fetchCartCount();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;

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
        }),
      });

      if (!response.ok) {
        throw new Error('カートへの追加に失敗しました');
      }

      setCartItemsCount(prev => prev + quantity);
      alert('カートに追加しました');
    } catch (error) {
      console.error('Cart error:', error);
      alert('カートへの追加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={cartItemsCount} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 relative">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                fill
                className="object-cover"
              />
            )}
            {product.stock <= 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="bg-black text-white px-6 py-3 rounded-full text-lg font-black">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black">{product.name}</h1>
            <p className="text-2xl font-bold text-black">¥{product.price.toLocaleString()}</p>
            <p className="text-gray-900 font-medium">{product.description}</p>

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
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isLoading}
                className={`flex-1 px-8 py-3 rounded-full font-bold text-lg
                  ${product.stock <= 0 || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:-translate-y-0.5 hover:shadow-lg transition-all'}`}
              >
                {product.stock <= 0 ? 'SOLD OUT' : isLoading ? '処理中...' : 'カートに追加'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}