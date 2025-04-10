"use client";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log("認証状態", status, session);

  return (
    <AppBar position="static" sx={{ backgroundColor: "info.main" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link href={"/"} passHref>
          <Typography
            variant="h6"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            Training Log
          </Typography>
        </Link>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/" passHref>
            ホーム
          </Link>
          <Link href="/register" passHref>
            新規登録
          </Link>
          {user ? (
            <Button
              color="inherit"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              ログアウト
            </Button>
          ) : (
            <Link href="/login" passHref>
              ログイン
            </Link>
          )}

          <div className="w-20 h-12 border border-white-300 rounded flex items-center justify-center">
            <span className="text-sm text-gray-300">
              {session?.user?.name || "Guest"}
            </span>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
