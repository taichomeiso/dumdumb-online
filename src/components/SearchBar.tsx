import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const SearchBar = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  
  // URLのクエリパラメータと同期を取る
  useEffect(() => {
    if (typeof router.query.q === 'string') {
      setQuery(router.query.q)
    }
  }, [router.query.q])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push({
        pathname: '/products',
        query: { q: query }
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="商品を検索..."
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 text-white bg-primary rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          検索
        </button>
      </div>
    </form>
  )
}

export default SearchBar