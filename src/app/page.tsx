import { PostType } from "@/types";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { nextAuthOptions } from "./lib/next-auth/options";

async function fetchAllLogs() {
  const res = await fetch(`http://localhost:3000/api/log`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data.posts;
}

export default async function Home() {
  const posts = await fetchAllLogs();
  const session = await getServerSession(nextAuthOptions);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // 水平中央
        }}
      >
        <Button
          component={Link}
          href={"/log/add"}
          variant="contained"
          sx={{
            width: { xs: "40%", md: "25%" },
            textAlign: "center",
            p: 2,
            mt: 2,
            backgroundColor: "success.main",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          今日の筋トレ記録する✍️
        </Button>
      </Box>
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: 3,
        }}
      >
        {posts.map((post: PostType) => (
          <Card
            key={post.id}
            sx={{
              width: "75%",
              mb: 2,
              p: 1,
              backgroundColor: "gray.300",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" component="h2">
                    {post.user.name}
                    <br />
                    {post.menu.name}
                  </Typography>

                  <Typography variant="h6">
                    {post.weight}kg×{post.reps}回×{post.sets}セット
                  </Typography>
                </Box>
                {session?.user?.id === post.userId && (
                  <Button
                    variant="contained"
                    component={Link}
                    href={`/log/edit/${post.id}`}
                  >
                    編集
                  </Button>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary">
                {new Date(post.date).toDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
}
