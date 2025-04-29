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
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
        <Link href={"/"} passHref>
          <Typography
            variant="h6"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontSize: { xs: "1rem", sm: "1.15rem" },
              fontWeight: "bold",
            }}
          >
            Training Log
          </Typography>
        </Link>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            flexWrap: "wrap",
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          <Link href="/" passHref>
            ホーム
          </Link>
          {!user && (
            <Link href="/register" passHref>
              <Typography sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>
                新規登録
              </Typography>
            </Link>
          )}
          {user ? (
            <Button
              color="inherit"
              onClick={() => signOut({ callbackUrl: "/" })}
              sx={{
                fontSize: { xs: "0.75rem", sm: "1rem" },
                fontWeight: "bold",
              }}
            >
              ログアウト
            </Button>
          ) : (
            <Link href="/login" passHref>
              <Typography sx={{ fontSize: { xs: "0.75rem", sm: "1rem" } }}>
                ログイン
              </Typography>
            </Link>
          )}

          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "white",
              border: "1px solid white",
              borderRadius: "6px",
              px: 1.5,
              py: 0.5,
            }}
          >
            {session?.user?.name || "Guest"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
