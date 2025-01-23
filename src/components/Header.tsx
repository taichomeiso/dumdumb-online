"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, Heart, Search, User } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface HeaderProps {
  cartItemsCount?: number;
}

export function Header({ cartItemsCount = 0 }: HeaderProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  return (
    <header className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="transform hover:-translate-y-0.5 transition-transform"
            >
              <h1 className="text-4xl font-black tracking-tight text-black hover:text-gray-900">
                dumdumb
              </h1>
            </Link>
            {isAdmin && (
              <Link 
                href="/admin"
                className="text-sm font-bold text-black hover:text-gray-700 transition-colors"
              >
                商品登録
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-8">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="検索"
                className="w-48 pl-10 pr-4 py-2 bg-white border-2 border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-900"
              />
              <Search className="absolute left-3 top-2.5 text-black w-5 h-5" />
            </div>
            
            <Link href="/favorites" className="relative hover:-translate-y-0.5 transition-transform">
              <Heart className="w-6 h-6 text-black" />
            </Link>
            
            <Link href="/cart" className="relative hover:-translate-y-0.5 transition-transform">
              <ShoppingCart className="w-6 h-6 text-black" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:-translate-y-0.5 transition-transform">
                    {session.user?.image ? (
                      <div className="relative h-8 w-8">
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          fill
                          className="rounded-full"
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="text-sm">
                    {session.user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders" className="w-full">注文履歴</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">プロフィール設定</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" 
                  className="hover:-translate-y-0.5 transition-transform font-bold">
                  ログイン
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}