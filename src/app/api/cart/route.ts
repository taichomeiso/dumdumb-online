import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      // 未認証の場合は空の配列を返す
      return NextResponse.json([]);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json([]);
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: user.id
      },
      include: {
        product: true
      }
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json([]); // エラー時も空配列を返す
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { productId, quantity, size } = await request.json();

    // ユーザーの取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // 商品の存在確認
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    if (product.stock < quantity) {
      return new NextResponse('Not enough stock', { status: 400 });
    }

    // カートアイテムの作成または更新
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: user.id,
        productId: parseInt(productId),
        size: size || null
      }
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: parseInt(productId),
          quantity,
          size
        }
      });
    }

    return NextResponse.json({ message: 'Added to cart successfully' });
  } catch (error) {
    console.error('Cart add error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}