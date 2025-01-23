import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GETリクエスト - 商品一覧の取得
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: '商品の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POSTリクエスト - 商品の登録
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        imageUrl: data.imageUrl,
        stock: Number(data.stock),
        category: data.category,
        isNew: data.isNew,
        isFeatured: data.isFeatured,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: '商品の登録に失敗しました' },
      { status: 500 }
    );
  }
}