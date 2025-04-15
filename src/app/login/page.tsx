import { getProviders } from "next-auth/react";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const providers = await getProviders();

  return (
    <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm providers={providers} />
      </div>
    </div>
  );
}
