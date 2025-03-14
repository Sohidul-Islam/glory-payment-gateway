import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LoginData, loginUser } from "../../network/services";
import { cn } from "../../utils/utils";
import { toast } from "react-hot-toast";
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

      toast.success("Login successful!");
      // Redirect to dashboard using navigate
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Login failed");
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
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                className={cn(
                  "appearance-none rounded-md relative block w-full px-3 py-2 border",
                  "border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none",
                  "focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                  errors.email && "border-red-500"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: true })}
                className={cn(
                  "appearance-none rounded-md relative block w-full px-3 py-2 border",
                  "border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none",
                  "focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                  errors.password && "border-red-500"
                )}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  Password is required
                </p>
              )}
            </div>
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
      </div>
    </div>
  );
};
