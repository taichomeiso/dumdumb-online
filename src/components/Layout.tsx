import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary">dumdumb Shop</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/products" className="text-gray-700 hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                  商品一覧
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                  カテゴリー
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="text-gray-700 hover:text-primary">
                カート
              </Link>
              <Link href="/account" className="text-gray-700 hover:text-primary">
                マイページ
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white mt-8">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">ショップ情報</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li>
                  <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">カスタマーサービス</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li>
                  <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-base text-gray-500 hover:text-gray-900">
                    よくある質問
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-gray-500">© 2025 dumdumb Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout