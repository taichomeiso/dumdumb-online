import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import prisma from '../../lib/prisma'

type ProductProps = {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  stock: number
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(params?.id)
    }
  })

  if (!product) {
    return {
      notFound: true
    }
  }

  return {
    props: JSON.parse(JSON.stringify(product))
  }
}

const ProductDetails = ({ name, description, price, imageUrl, stock }: ProductProps) => {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          quantity,
          price,
        }),
      })

      if (!response.ok) {
        throw new Error('カートへの追加に失敗しました')
      }

      alert('カートに追加しました！')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('カートへの追加に失敗しました')
    }
  }

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* 商品画像 */}
          <div className="relative">
            <div className="relative w-full h-72 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>

          {/* 商品情報 */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{name}</h1>
            <div className="mt-3">
              <h2 className="sr-only">商品情報</h2>
              <p className="text-3xl text-gray-900">¥{price.toLocaleString()}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">商品説明</h3>
              <div className="text-base text-gray-700 space-y-4">
                {description}
              </div>
            </div>

            <div className="mt-8">
              {stock > 0 ? (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      数量
                    </label>
                    <select
                      id="quantity"
                      name="quantity"
                      className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      {[...Array(Math.min(10, stock))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="button"
                    className="w-full btn-primary flex items-center justify-center"
                    onClick={handleAddToCart}
                  >
                    カートに追加
                  </button>

                  {stock < 5 && (
                    <p className="text-sm text-red-500">
                      ※残り{stock}点のみ！
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-red-500 font-medium">
                  申し訳ありません。現在在庫切れです。
                </p>
              )}
            </div>

            {/* 商品詳細情報 */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">商品詳細</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul role="list" className="space-y-2">
                  <li>dumdumbオリジナルデザイン</li>
                  <li>高品質な素材を使用</li>
                  <li>お手入れ方法については商品タグをご確認ください</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails