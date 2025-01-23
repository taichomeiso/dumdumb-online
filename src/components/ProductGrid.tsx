import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

const categories = {
  tshirt: 'Tシャツ',
  hoodie: 'パーカー',
  cup: 'コップ',
  sticker: 'ステッカー',
  other: 'その他'
};

export async function ProductGrid() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      },
    });

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
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
                <div className="absolute top-4 right-4 flex gap-2">
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
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p>商品の読み込み中にエラーが発生しました。</p>
      </div>
    );
  }
}