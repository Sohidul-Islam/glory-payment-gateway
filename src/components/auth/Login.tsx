import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LoginData, loginUser } from "../../network/services";
import { cn, successToast } from "../../utils/utils";
import { Input } from "../ui/Input";

import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store token in cookie
      document.cookie = `access_token=${data.token}; path=/;`;

      // Store user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      successToast("Login successful!", "success");
      // Redirect to dashboard using navigate
      navigate("/");
    },
    onError: (error: Error) => {
      successToast(error?.message || "Login failed", "error");
    },
  });

  const onSubmit = (data: LoginData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              label="Email address"
              type="email"
              error={errors.email?.message}
            />

            <Input
              {...register("password", {
                required: "Password is required",
              })}
              label="Password"
              type="password"
              error={errors.password?.message}
            />
          </div>

          {mutation.isError && (
            <div className="text-red-500 text-sm text-center">
              Login failed. Please check your credentials.
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={cn(
                "group relative w-full flex justify-center py-2 px-4 border border-transparent",
                "text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                mutation.isPending && "opacity-50 cursor-not-allowed"
              )}
            >
              {mutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
