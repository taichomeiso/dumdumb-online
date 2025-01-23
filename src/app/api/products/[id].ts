import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const productId = Number(req.query.id)

  switch (req.method) {
    case 'GET':
      try {
        const product = await prisma.product.findUnique({
          where: { id: productId },
          include: { categories: true }
        })
        if (product) {
          res.json(product)
        } else {
          res.status(404).json({ message: 'Product not found' })
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' })
      }
      break

    case 'PUT':
      try {
        const { name, description, price, stock, imageUrl, categoryIds } = req.body
        const updatedProduct = await prisma.product.update({
          where: { id: productId },
          data: {
            name,
            description,
            price,
            stock,
            imageUrl,
            categories: {
              set: categoryIds?.map((id: number) => ({ id })) || []
            }
          },
          include: { categories: true }
        })
        res.json(updatedProduct)
      } catch (error) {
        res.status(500).json({ error: 'Failed to update product' })
      }
      break

    case 'DELETE':
      try {
        await prisma.product.delete({
          where: { id: productId }
        })
        res.status(204).end()
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}