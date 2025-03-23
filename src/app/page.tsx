import { PostType } from "@/types";
import Link from "next/link";

async function fetchAllLogs() {
  const res = await fetch(`http://localhost:3000/api/log`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data.posts;
}

export default async function Home() {
  const posts = await fetchAllLogs();

  return (
    <main className="w-full h-full">
      <div className="flex my-5">
        <Link
          href={"/log/add"}
          className=" md:w-1/4 sm:w-2/4 text-center rounded-md p-4 m-auto bg-blue-200 font-semibold"
        >
          今日の筋トレ記録する✍️
        </Link>
      </div>

      <div className="w-1/2 flex flex-col justify-center m-auto items-center">
        {posts.map((post: PostType) => (
          <div
            key={post.id}
            className="w-3/4 p-4 rounded-md mx-3 my-2 bg-slate-300 flex flex-col justify-center"
          >
            <div className="flex items-center my-3">
              <div className="mr-auto">
                <h2 className="mr-auto font-semibold">
                  {post.userId}
                  <br />
                  {post.menu.name}
                </h2>
                <h3>
                  {post.weight}kg×{post.reps}回×{post.sets}セット
                </h3>
              </div>
              <Link
                href={`/log/edit/${post.id}`}
                className="px-4 py-2 text-center text-xl bg-slate-900 rounded-md font-semibold text-slate-200"
              >
                編集
              </Link>
            </div>

            <div className="mr-auto my-1">
              <blockquote className="font-bold text-slate-700">
                {new Date(post.date).toDateString()}
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
