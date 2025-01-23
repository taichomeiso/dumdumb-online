import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETEリクエスト - 商品の削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.delete({
      where: {
        id: Number(params.id),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: '商品の削除に失敗しました' },
      { status: 500 }
    );
  }
}