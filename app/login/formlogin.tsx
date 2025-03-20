import { Lock, User } from "lucide-react";

export function Form({
  action,
  children,
}: {
  action?: string | ((formData: FormData) => void | Promise<void>);
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-900 p-6"
      style={{
        backgroundImage: "url('/logo.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        action={action}
        className="w-full max-w-sm rounded-xl bg-gray-800 p-8 shadow-xl backdrop-blur-md bg-opacity-80"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-100">
          Monitoring Sarana
        </h2>
        <div className="relative mb-4">
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-300"
          >
            User ID
          </label>
          <div className="relative mt-1">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              id="id"
              name="id"
              type="text"
              autoComplete="id"
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-10 pr-3 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              placeholder="Enter your ID"
            />
          </div>
        </div>
        <div className="relative mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <div className="relative mt-1">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-10 pr-3 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              placeholder="Enter your password"
            />
          </div>
        </div>
        {children}
      </form>
    </div>
  );
}
