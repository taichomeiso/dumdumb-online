import { GetServerSideProps } from 'next'
import { useState } from 'react'
import prisma from '../../lib/prisma'
import ProductCard from '../../components/ProductCard'
import SearchBar from '../../components/SearchBar'

type Product = {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  stock: number
  categories: {
    id: number
    name: string
  }[]
}

type Category = {
  id: number
  name: string
}

type ProductsPageProps = {
  products: Product[]
  categories: Category[]
  initialQuery?: string
  selectedCategory?: number
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { q, category } = query
  const searchQuery = typeof q === 'string' ? q : ''
  const categoryId = typeof category === 'string' ? parseInt(category) : undefined

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          searchQuery ? {
            OR: [
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } }
            ]
          } : {},
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

    const categories = await prisma.category.findMany()

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        categories: JSON.parse(JSON.stringify(categories)),
        initialQuery: searchQuery || '',
        selectedCategory: categoryId || null
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      props: {
        products: [],
        categories: [],
        initialQuery: searchQuery || '',
        selectedCategory: categoryId || null
      }
    }
  }
}

const ProductsPage = ({ products, categories, initialQuery, selectedCategory }: ProductsPageProps) => {
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest')

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">商品一覧</h1>
        <div className="mt-4 md:mt-0">
          <SearchBar />
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row">
        {/* サイドバー */}
        <div className="w-full md:w-64 flex-shrink-0">
          <h3 className="text-lg font-medium text-gray-900">カテゴリー</h3>
          <ul className="mt-4 space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <a
                  href={`/products?category=${category.id}`}
                  className={`block px-2 py-1 rounded-md ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">並び替え</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="newest">新着順</option>
              <option value="price-asc">価格が安い順</option>
              <option value="price-desc">価格が高い順</option>
            </select>
          </div>
        </div>

        {/* 商品一覧 */}
        <div className="mt-8 md:mt-0 md:ml-8 flex-1">
          {initialQuery && (
            <p className="mb-4 text-gray-600">
              &quot;{initialQuery}&quot; の検索結果: {products.length}件
            </p>
          )}

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">商品が見つかりませんでした。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage