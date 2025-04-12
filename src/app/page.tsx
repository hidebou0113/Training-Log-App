export const dynamic = "force-dynamic";

import { PostType } from "@/types";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { nextAuthOptions } from "./lib/next-auth/options";

async function fetchAllLogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/log`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data.posts ?? [];
}

export default async function Home() {
  const posts: PostType[] = await fetchAllLogs();
  const session = await getServerSession(nextAuthOptions);

  const groupedLogs = posts.reduce((groups, post) => {
    const dateTimeKey = new Date(post.date).toISOString().slice(0, 16);
    const key = `${post.user.id}-${dateTimeKey}`;

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(post);
    return groups;
  }, {} as Record<string, PostType[]>);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
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
        {Object.entries(groupedLogs).map(([date, logs]) => (
          <Card
            key={date}
            sx={{
              width: "40%",
              mb: 2,
              p: 1,
              backgroundColor: "gray.300",
            }}
          >
            <CardContent>
              <Typography variant="h6" component="h2">
                {logs[0].user.name}
              </Typography>

              {logs.map((post) => (
                <Box
                  key={post.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    borderTop:
                      logs.indexOf(post) > 0 ? "1px solid #eee" : "none",
                    pt: logs.indexOf(post) > 0 ? 1 : 0,
                  }}
                >
                  <Box>
                    <Typography variant="h6" component="h2">
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
              ))}

              <Typography variant="body2" color="text.secondary">
                {new Date(logs[0].date).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
}
