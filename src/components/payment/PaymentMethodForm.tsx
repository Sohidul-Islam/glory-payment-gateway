/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  PaymentMethodData,
  PaymentMethodType,
  createPaymentMethod,
  uploadFile,
} from "../../network/services";

import { toast } from "react-hot-toast";
import { useState } from "react";
import { cn } from "../../utils/utils";

const PAYMENT_METHODS: PaymentMethodType[] = [
  "MOBILE_BANKING",
  "VISA",
  "MASTERCARD",
  "CREDIT_CARD",
  "USDT",
];

export const PaymentMethodForm = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentMethodData>({
    defaultValues: {
      status: "active",
    },
  });

  const mutation = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      toast.success("Payment method created successfully!");
      onSuccess?.();
      // Reset form or redirect
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create payment method");
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadFile(file);
      setValue("image", url);
      setImagePreview(url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: PaymentMethodData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            {...register("name", { required: "Payment method is required" })}
            className={cn(
              "mt-1 block border border-1 w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none",
              "focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
              errors.name && "border-red-300"
            )}
          >
            <option value="">Select a payment method</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method.replace("_", " ")}
              </option>
            ))}
          </select>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="flex-shrink-0">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-md"
                />
              )}
            </div>
            <label
              className={cn(
                "cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300",
                "shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white",
                "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                isUploading && "opacity-50 cursor-not-allowed"
              )}
            >
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {isUploading ? "Uploading..." : "Upload Image"}
            </label>
          </div>
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
          )}
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="mt-1 border border-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isPending || isUploading}
          className={cn(
            "w-full flex justify-center py-2 px-4 border border-transparent rounded-md",
            "shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            (mutation.isPending || isUploading) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          {mutation.isPending ? "Creating..." : "Create Payment Method"}
        </button>
      </form>
    </div>
  );
};
