"use client";

import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      const res = await getProviders();
      setProviders(res);
    }
    fetchProviders();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleCredentialsLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      console.log("signIn response:", res);

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setErrorMessage("メールアドレスまたはパスワードが間違っています。");
        } else {
          setErrorMessage("ログインに失敗しました。");
        }
      } else if (res?.ok && res.url) {
        router.push(res.url);
      }
    } catch (err) {
      console.error("ログインエラー", err);
      setErrorMessage("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {providers &&
            Object.values(providers)
              .filter((provider) => provider.id !== "credentials")
              .map((provider: ClientSafeProvider) => {
                return (
                  <div key={provider.id} className="text-center">
                    <button
                      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                      className="bg-slate-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-2"
                        fill="currentColor"
                      >
                        <title>Google icon</title>
                        <path
                          fill="#4285F4"
                          d="M23.64 12.2045c0-.639-.0575-1.2515-.1635-1.836H12v3.482h6.4845c-.281 1.1275-1.031 2.0855-2.189 2.722v2.2585h3.5415c2.07-1.904 3.27-4.7035 3.27-7.627z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.243 0 5.975-1.071 7.966-2.903l-3.5415-2.2585c-.986.664-2.2535 1.055-4.4245 1.055-3.392 0-6.26-2.29-7.28-5.376H1.993V17.03C3.991 21.022 7.726 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M4.72 14.675c-.227-.68-.357-1.404-.357-2.155 0-.752.13-1.476.357-2.156V7.202H1.993A11.942 11.942 0 0 0 0 12c0 1.956.467 3.81 1.993 5.798l2.727-2.123z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.764c1.757 0 3.337.605 4.58 1.788l3.433-3.433C17.97 1.306 15.238 0 12 0 7.725 0 3.99 2.978 1.993 7.202l2.727 2.123C5.74 6.054 8.608 4.764 12 4.764z"
                        />
                      </svg>
                      <span>Googleでログイン</span>
                    </button>
                  </div>
                );
              })}

          <form onSubmit={handleCredentialsLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@example.com"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errorMessage && (
                <p className="text-red-600 font-semibold text-sm mt-2 bg-red-100 border border-red-300 rounded px-3 py-2 shadow-sm">
                  {errorMessage}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              >
                {loading ? "ログイン中..." : "ログイン"}
              </button>
            </div>
            <Link
              href="/register"
              className="bg-green-600 text-white px-4 py-2 flex justify-center rounded shadow hover:bg-green-600"
            >
              未登録の方はこちらから新規登録
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
