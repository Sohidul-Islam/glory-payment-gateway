/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { RegisterData, registerUser } from "../../network/services";
import { cn } from "../../utils/utils";
import { useState } from "react";

export const Register = () => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Handle success (e.g., redirect to login)
      console.log("Registration successful");
    },
  });

  const onSubmit = (data: RegisterData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                {...register("fullName", { required: true })}
                className={cn(
                  "appearance-none rounded-md relative block w-full px-3 py-2 border",
                  "border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none",
                  "focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                  errors.fullName && "border-red-500"
                )}
              />
            </div>

            {/* Add similar input fields for:
                            - email
                            - phoneNumber
                            - location
                            - businessName
                            - businessType
                            - password
                        */}
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
              {mutation.isPending ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
