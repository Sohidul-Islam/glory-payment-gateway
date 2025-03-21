/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  PaymentMethodData,
  PaymentMethodType,
  createPaymentMethod,
  getPaymentMethodById,
} from "../../network/services";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { cn, uploadFile } from "../../utils/utils";
import { ImagePlus, Loader2, X } from "lucide-react";

const PAYMENT_METHODS: PaymentMethodType[] = [
  "MOBILE_BANKING",
  // "VISA",
  "BANK",
  // "MASTERCARD",
  // "CREDIT_CARD",
  "USDT",
];

export const PaymentMethodForm = ({
  onSuccess,
  methodId,
}: {
  onSuccess?: () => void;
  methodId?: number;
}) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PaymentMethodData>({
    defaultValues: {
      status: "active",
    },
  });

  const { data, isLoading: isLoadingMethod } = useQuery({
    queryKey: ["paymentMethod", methodId],
    queryFn: () => getPaymentMethodById(methodId!),
    enabled: !!methodId,
  });

  const mutation = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      toast.success("Payment method created successfully!");
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create payment method");
    },
  });

  useEffect(() => {
    if (data) {
      const method = data;
      reset({
        name: method.name,
        status: method.status,
        image: method.image,
      });
      // Set image preview
      setImagePreview(method.image);
    }
  }, [data]);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);

      // Create a local preview immediately using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const url = await uploadFile(file);
      setValue("image", url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
      setImagePreview(""); // Clear preview on error
      setValue("image", "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setImagePreview("");
    setValue("image", "");
  };

  const onSubmit = (data: PaymentMethodData) => {
    mutation.mutate({ ...data, id: methodId });
  };

  if (isLoadingMethod) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
              "mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
              errors.name ? "border-red-300" : "border-gray-300"
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

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Image
          </label>
          <div
            className={cn(
              "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg",
              isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300",
              "transition-colors duration-200"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-2 text-center">
              {imagePreview ? (
                <div className="relative inline-block group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-contain rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md 
                             hover:bg-red-50 transition-colors group-hover:opacity-100 
                             opacity-0 transition-opacity duration-200"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    {isUploading ? (
                      <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                    ) : (
                      <ImagePlus className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </>
              )}
            </div>
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
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            "transition-colors duration-200",
            (mutation.isPending || isUploading) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          {mutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </span>
          ) : (
            "Create Payment Method"
          )}
        </button>
      </form>
    </div>
  );
};
