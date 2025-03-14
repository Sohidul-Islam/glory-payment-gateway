/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { RegisterData, registerUser } from "../../network/services";
import { cn, successToast } from "../../utils/utils";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      successToast("Registration successful! Please login.", "success");
      navigate("/login");
    },
    onError: (error: any) => {
      successToast(error?.message || "Registration failed", "warn");
    },
  });

  const onSubmit = (data: RegisterData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  className={cn(
                    "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400",
                    "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.fullName ? "border-red-300" : "border-gray-300"
                  )}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={cn(
                    "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400",
                    "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.email ? "border-red-300" : "border-gray-300"
                  )}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  className={cn(
                    "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400",
                    "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.phoneNumber ? "border-red-300" : "border-gray-300"
                  )}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <div className="mt-1">
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className={cn(
                    "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400",
                    "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.location ? "border-red-300" : "border-gray-300"
                  )}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={cn(
                    "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400",
                    "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                    errors.password ? "border-red-300" : "border-gray-300"
                  )}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className={cn(
                  "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
                  "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                  mutation.isPending && "opacity-50 cursor-not-allowed"
                )}
              >
                {mutation.isPending ? "Creating account..." : "Create account"}
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
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
