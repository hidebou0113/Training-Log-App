"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log("認証状態", status, session);

  return (
    <header className="bg-slate-600 text-gray-100 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-xl font-bold">
          Training Log
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            ホーム
          </Link>
          <Link
            href="/register"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            新規登録
          </Link>
          {user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              ログアウト
            </button>
          ) : (
            <Link
              href="/login"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              ログイン
            </Link>
          )}

          <Link href={`/profile`}>
            <div className="w-20 h-12 border border-white-300 rounded flex items-center justify-center">
              <span className="text-sm text-gray-300">
                {session?.user?.name || "Guest"}
              </span>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
