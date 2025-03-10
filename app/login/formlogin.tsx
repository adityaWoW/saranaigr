import { Lock, User } from "lucide-react";

export function Form({
  action,
  children,
}: {
  action?: string | ((formData: FormData) => void | Promise<void>);
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <form
        action={action}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl transition-transform hover:scale-105"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Monitoring Sarana
        </h2>
        <div className="relative mb-4">
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-700"
          >
            User ID
          </label>
          <div className="relative mt-1">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              id="id"
              name="id"
              type="id"
              autoComplete="id"
              required
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-300"
            />
          </div>
        </div>
        <div className="relative mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative mt-1">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-300"
            />
          </div>
        </div>
        {children}
      </form>
    </div>
  );
}
