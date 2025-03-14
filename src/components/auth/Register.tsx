/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { RegisterData, registerUser } from "../../network/services";
import { cn, successToast } from "../../utils/utils";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/Input";

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
            <Input
              {...register("fullName", { required: "Full name is required" })}
              label="Full Name"
              error={errors.fullName?.message}
            />

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
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
              label="Phone Number"
              error={errors.phoneNumber?.message}
            />

            <Input
              {...register("location", { required: "Location is required" })}
              label="Location"
              error={errors.location?.message}
            />

            <Input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              label="Password"
              type="password"
              error={errors.password?.message}
            />

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
