import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
      status: 401,
    });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return new NextResponse(JSON.stringify(products), {
      status: 200,
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return new NextResponse(JSON.stringify({ error: '商品の取得に失敗しました' }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        imageUrl: body.image, // imageをimageUrlとして使用
        category: body.category,
        stock: body.stock,
        isNew: body.isNew,
        isFeatured: body.isFeatured,
      },
    });

    return new NextResponse(JSON.stringify(product), {
      status: 201,
    });
  } catch (error) {
    console.error('Product creation error:', error);
    return new NextResponse(JSON.stringify({ error: '商品の作成に失敗しました' }), {
      status: 500,
    });
  }
}