'use server'

import prisma from '@/lib/prisma'

export async function getProducts(category?: string) {
  try {
    return await prisma.product.findMany({
      where: category && category !== 'all' ? {
        category: category
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      },
    })
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}