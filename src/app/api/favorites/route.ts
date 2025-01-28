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

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id
      },
      include: {
        product: true
      }
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Favorites fetch error:', error);
    return NextResponse.json([]); // エラー時は空配列を返す
  }
}

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

    const { productId } = await request.json();

    // 商品の存在確認
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    // お気に入りの存在確認
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        productId: parseInt(productId)
      }
    });

    if (existingFavorite) {
      // お気に入りから削除
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      return NextResponse.json({
        message: 'お気に入りから削除しました',
        isFavorite: false
      });
    } else {
      // お気に入りに追加
      await prisma.favorite.create({
        data: {
          userId: user.id,
          productId: parseInt(productId)
        }
      });
      return NextResponse.json({
        message: 'お気に入りに追加しました',
        isFavorite: true
      });
    }
  } catch (error) {
    console.error('Favorite toggle error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}