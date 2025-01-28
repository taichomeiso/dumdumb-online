import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // カート内のアイテムを取得
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return new NextResponse('Cart is empty', { status: 400 });
    }

    // 在庫チェック
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return new NextResponse(`${item.product.name} の在庫が不足しています`, { status: 400 });
      }
    }

    // 合計金額の計算
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 注文の作成
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        orderItems: {
          create: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    // 在庫の更新
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.product.id },
        data: { stock: item.product.stock - item.quantity }
      });
    }

    // カートを空にする
    await prisma.cartItem.deleteMany({
      where: { userId: user.id }
    });

    // TODO: 実際の決済処理を実装する場合は、ここでStripe等の決済サービスのセッションを作成

    // 仮の実装: 注文確認ページへリダイレクト
    return NextResponse.json({ 
      url: `/orders/${order.id}`,
      orderId: order.id 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}