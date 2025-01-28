'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
}

interface Category {
  id: string;
  label: string;
}

interface NewProduct {
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  stock: string;
  isNew: boolean;
  isFeatured: boolean;
}

const categories: Category[] = [
  { id: 'tshirt', label: 'Tシャツ' },
  { id: 'hoodie', label: 'パーカー' },
  { id: 'cup', label: 'コップ' },
  { id: 'sticker', label: 'ステッカー' },
  { id: 'other', label: 'その他' }
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'tshirt',
    stock: '0',
    isNew: false,
    isFeatured: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else {
      void fetchProducts();
    }
  }, [session, status, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (): Promise<string> => {
    if (!selectedFile) {
      throw new Error('ファイルが選択されていません');
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '画像のアップロードに失敗しました');
      }

      const data = await response.json();
      if (!data.url) {
        throw new Error('画像のURLの取得に失敗しました');
      }
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('画像のアップロードに失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = newProduct.image;
      
      if (selectedFile) {
        imageUrl = await handleUpload();
      }

      const productData = {
        ...newProduct,
        price: parseInt(newProduct.price),
        stock: parseInt(newProduct.stock),
        image: imageUrl,
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '商品の登録に失敗しました');
      }

      setNewProduct({
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'tshirt',
        stock: '0',
        isNew: false,
        isFeatured: false,
      });
      setSelectedFile(null);
      setPreview(null);
      
      void fetchProducts();
      alert('商品を登録しました');
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : '商品の登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('本当にこの商品を削除しますか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '商品の削除に失敗しました');
      }

      alert('商品を削除しました');
      void fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : '商品の削除に失敗しました');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '商品の取得に失敗しました');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert(error instanceof Error ? error.message : '商品の取得に失敗しました');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-black text-black mb-6">商品登録</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-bold text-black mb-1">
                商品名
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-900 rounded-md text-black font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-1">
                カテゴリー
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-900 rounded-md text-black font-medium"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-1">
                価格
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-900 rounded-md text-black font-medium"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-1">
                在庫数
              </label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-900 rounded-md text-black font-medium"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-1">
                説明
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-900 rounded-md text-black font-medium"
                required
                rows={4}
              />
            </div>

            <div>
              <label className="block text-base font-bold text-black mb-1">
                商品画像
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*"
                className="w-full px-3 py-2 border-2 border-gray-900 rounded-md text-black font-medium"
                required
              />
              {preview && (
                <div className="mt-2 relative w-32 h-32">
                  <Image
                    src={preview}
                    alt="プレビュー"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newProduct.isNew}
                  onChange={(e) => setNewProduct({ ...newProduct, isNew: e.target.checked })}
                  className="mr-2 w-4 h-4 border-2 border-gray-900"
                />
                <span className="text-base font-bold text-black">新着商品</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newProduct.isFeatured}
                  onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                  className="mr-2 w-4 h-4 border-2 border-gray-900"
                />
                <span className="text-base font-bold text-black">おすすめ商品</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 font-bold text-lg mt-6"
            >
              {isLoading ? '登録中...' : '商品を登録'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-black text-black mb-6">登録済み商品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border-2 border-gray-900 rounded-lg p-4">
                <div className="relative w-full h-48">
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="商品を削除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-start mt-4 mb-3">
                  <h3 className="text-lg font-bold text-black">{product.name}</h3>
                  <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                    {categories.find(c => c.id === product.category)?.label || product.category}
                  </span>
                </div>
                <p className="text-black font-bold mb-2">¥{product.price.toLocaleString()}</p>
                <p className="text-black font-medium">在庫: {product.stock}点</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}