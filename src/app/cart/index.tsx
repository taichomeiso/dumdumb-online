import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import prisma from '../../lib/prisma'

type CartItem = {
  id: number
  product: {
    id: number
    name: string
    price: number
    imageUrl: string
  }
  quantity: number
  price: number
}

type CartProps = {
  items: CartItem[]
  total: number
}

export const getServerSideProps: GetServerSideProps = async () => {
  // 本来はここでユーザーの認証を行い、ユーザーIDを取得します
  const userId = 1 // 開発用の仮のユーザーID

  const order = await prisma.order.findFirst({
    where: {
      userId,
      status: 'pending'
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  })

  if (!order) {
    return {
      props: {
        items: [],
        total: 0
      }
    }
  }

  const items = order.orderItems.map(item => ({
    id: item.id,
    product: {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl
    },
    quantity: item.quantity,
    price: item.price
  }))

  return {
    props: {
      items,
      total: order.total
    }
  }
}

const Cart = ({ items, total }: CartProps) => {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      // チェックアウト処理の実装（後ほど追加）
      alert('チェックアウト処理を実装予定です')
    } catch (error) {
      console.error('Checkout error:', error)
      alert('チェックアウトに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            カートが空です
          </h1>
          <p className="mt-4 text-base text-gray-500">
            商品をお探しですか？
          </p>
          <div className="mt-6">
            <Link href="/products" className="btn-primary inline-block">
              商品一覧へ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
        ショッピングカート
      </h1>

      <div className="mt-12">
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="py-6 flex">
              <div className="relative flex-shrink-0 w-24 h-24">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="w-full h-full rounded-md object-center object-cover"
                />
              </div>

              <div className="ml-4 flex-1 flex flex-col">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-gray-900">
                      <Link href={`/products/${item.product.id}`}>
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="ml-4 text-base font-medium text-gray-900">
                      ¥{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex-1 pt-2 flex items-end justify-between">
                  <p className="mt-1 text-sm text-gray-500">
                    数量: {item.quantity}
                  </p>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:text-secondary"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>小計</p>
          <p>¥{total.toLocaleString()}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          送料と税金は checkout 時に計算されます
        </p>
        <div className="mt-6">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full btn-primary flex justify-center py-3 px-4"
          >
            {loading ? '処理中...' : 'レジに進む'}
          </button>
        </div>
        <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
          <p>
            または{' '}
            <Link href="/products" className="text-primary font-medium hover:text-secondary">
              お買い物を続ける
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cart