import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// カート内アイテムの数量を更新
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { quantity } = await request.json();

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: { product: true }
    });

    if (!cartItem) {
      return new NextResponse('Cart item not found', { status: 404 });
    }

    if (cartItem.product.stock < quantity) {
      return new NextResponse('Not enough stock', { status: 400 });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity }
    });

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error('Cart update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// カート内アイテムの削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id }
    });

    if (!cartItem) {
      return new NextResponse('Cart item not found', { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Cart delete error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}