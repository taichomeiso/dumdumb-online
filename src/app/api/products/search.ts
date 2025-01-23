import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { q, category } = req.query
  const query = typeof q === 'string' ? q : ''
  const categoryId = typeof category === 'string' ? parseInt(category) : undefined

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } }
            ]
          },
          categoryId ? {
            categories: {
              some: {
                id: categoryId
              }
            }
          } : {}
        ]
      },
      include: {
        categories: true
      }
    })

    res.json(products)
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ error: 'Failed to search products' })
  }
}