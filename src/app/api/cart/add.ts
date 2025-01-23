import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { productId, quantity } = req.body

    // 本来はここでユーザーの認証を行い、ユーザーIDを取得します
    // const userId = req.user.id
    const userId = 1 // 開発用の仮のユーザーID

    // 注文が存在しない場合は新規作成
    let order = await prisma.order.findFirst({
      where: {
        userId,
        status: 'pending'
      }
    })

    if (!order) {
      order = await prisma.order.create({
        data: {
          userId,
          status: 'pending',
          total: 0
        }
      })
    }

    // 商品情報の取得
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // 在庫チェック
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' })
    }

    // 注文アイテムの作成または更新
    const orderItem = await prisma.orderItem.upsert({
      where: {
        orderId_productId: {
          orderId: order.id,
          productId
        }
      },
      update: {
        quantity: { increment: quantity },
        price: product.price
      },
      create: {
        orderId: order.id,
        productId,
        quantity,
        price: product.price
      }
    })

    // 注文の合計金額を更新
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        total: {
          increment: product.price * quantity
        }
      }
    })

    res.status(200).json(orderItem)
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ message: 'Error adding to cart' })
  }
}