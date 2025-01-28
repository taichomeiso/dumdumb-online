'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        role: "admin",
        redirect: false,
        callbackUrl: "/admin"
      });

      console.log("Sign in result:", result);

      if (!result?.ok) {
        setError("ログインに失敗しました。認証情報を確認してください。");
        return;
      }

      // ログイン成功時の処理
      await router.push("/admin");
      router.refresh();
      
    } catch (error) {
      console.error("Login error:", error);
      setError("ログインに失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)]">
      <div className="w-full max-w-lg">
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-8">
            管理者ログイン
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-bold text-gray-900 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black transition-colors"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-bold text-gray-900 mb-2">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:border-black focus:ring-1 focus:ring-black transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors font-bold text-lg mt-8 disabled:bg-gray-400"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}