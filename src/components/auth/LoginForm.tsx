"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthState, LoginCredentials, AuthProvider } from "@/types/auth"

export function LoginForm() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setAuthState({ isLoading: true, error: null })

    const formData = new FormData(e.currentTarget)
    const credentials: LoginCredentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string
    }

    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      })

      if (result?.error) {
        setAuthState({
          isLoading: false,
          error: "メールアドレスまたはパスワードが正しくありません"
        })
        return
      }

      router.push("/store")
      router.refresh()
    } catch {
      setAuthState({
        isLoading: false,
        error: "エラーが発生しました。もう一度お試しください。"
      })
    }
  }

  const handleProviderLogin = async (provider: AuthProvider): Promise<void> => {
    setAuthState({ ...authState, isLoading: true })
    try {
      await signIn(provider, { callbackUrl: "/store" })
    } catch {
      setAuthState({
        isLoading: false,
        error: "ログインに失敗しました。もう一度お試しください。"
      })
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            disabled={authState.isLoading}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            disabled={authState.isLoading}
            className="w-full"
          />
        </div>
        {authState.error && (
          <Alert variant="destructive">
            <AlertDescription>{authState.error}</AlertDescription>
          </Alert>
        )}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={authState.isLoading}
        >
          {authState.isLoading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            または
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => handleProviderLogin('google')}
        disabled={authState.isLoading}
      >
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        Googleでログイン
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">アカウントをお持ちでない方は</span>{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => router.push("/auth/register")}
        >
          新規登録
        </Button>
      </div>
    </div>
  )
}