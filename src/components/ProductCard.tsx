import Image from 'next/image'
import Link from 'next/link'

type ProductCardProps = {
  id: number
  name: string
  price: number
  imageUrl: string
  description: string
}

const ProductCard = ({ id, name, price, imageUrl, description }: ProductCardProps) => {
  return (
    <Link href={`/products/${id}`} className="group">
      <div className="w-full bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-64 w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
          <p className="mt-2 text-lg font-semibold text-primary">
            ¥{price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard