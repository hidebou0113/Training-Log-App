import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新規登録
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
