/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import {
  CreatePaymentTypeData,
  PaymentType,
  createPaymentType,
  getPaymentMethods,
  PaymentMethodType,
  updatePaymentType,
} from "../../network/services";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { cn, successToast, uploadFile } from "../../utils/utils";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { Input } from "../ui/Input";

interface PaymentTypeFormProps {
  onSuccess?: () => void;
  initialData?: PaymentType | null;
}

export const PaymentTypeForm = ({
  onSuccess,
  initialData,
}: PaymentTypeFormProps) => {
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType | "">("");

  const { data: paymentMethods = [], isLoading: isLoadingMethods } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: getPaymentMethods,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePaymentTypeData>({
    defaultValues: {
      id:initialData?.id,
      paymentMethodId: initialData?.paymentMethodId || 0,
      name: initialData?.name || "",
      image: initialData?.image || "",
      details: initialData?.PaymentDetails?.map(detail => ({
        id:detail.id,
        value: detail.value,
        description: detail.description || "",
        maxLimit: detail.maxLimit,
      })) || [{ value: "", description: "", maxLimit: "0" }],
    },
  });

  // Set initial payment method when component mounts or initialData changes
  useEffect(() => {
    if (initialData?.paymentMethodId && paymentMethods.length > 0) {
      const method = paymentMethods.find(m => m.id === initialData.paymentMethodId);
      setSelectedPaymentMethod(method?.name || "");
    }
  }, [initialData, paymentMethods]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      // Create preview immediately
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
      setImagePreview("");
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

  const mutation = useMutation({
    mutationFn: initialData?.id? updatePaymentType: createPaymentType,
    onSuccess: (data) => {
      console.log({ data });
      if (data?.status) {
        successToast((data as any)?.message || "", "success");
        onSuccess?.();
      } else {
        successToast((data as any)?.message, "error");
      }
    },
    onError: (err) => {
      successToast(err.message, "error");
    },
  });

  if (isLoadingMethods) {
    return <Loader2 className="w-8 h-8 animate-spin" />;
  }

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = paymentMethods.find(m => m.id === Number(e.target.value));
    setSelectedPaymentMethod(method?.name || "");
    setValue("paymentMethodId", Number(e.target.value));
  };

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <div className="space-y-8">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Type Image
          </label>
          <div
            className={cn(
              "relative group cursor-pointer transition-all duration-300",
              "border-2 border-dashed rounded-xl p-8",
              isDragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-400",
              imagePreview ? "p-4" : "p-8"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
          >
            {imagePreview ? (
              <div className="relative inline-block group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-40 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");
                    setValue("image", "");
                  }}
                  className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-lg 
                           hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                {isUploading ? (
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                ) : (
                  <div className="p-4 bg-indigo-50 rounded-full">
                    <ImagePlus className="w-8 h-8 text-indigo-500" />
                  </div>
                )}
                <div className="text-center">
                  <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
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
                  <p className="text-sm text-gray-500">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              value={watch("paymentMethodId")}
              onChange={handlePaymentMethodChange}
              className={cn(
                "mt-1 block w-full rounded-lg border shadow-sm py-2.5 px-3",
                "bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                errors.paymentMethodId ? "border-red-300" : "border-gray-300"
              )}
            >
              <option value="">Select a payment method</option>
              {paymentMethods.map((method: any) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
            {errors.paymentMethodId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.paymentMethodId.message}
              </p>
            )}
          </div>

          <Input
            label="Type Name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />
        </div>

        {/* Details Section - Only show for MOBILE_BANKING */}
        {selectedPaymentMethod === "MOBILE_BANKING" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">
                Payment Details
              </h4>
              <button
                type="button"
                onClick={() =>
                  append({
                    value: "",
                    description: "",
                    maxLimit: "0",
                  })
                }
                className={cn(
                  "inline-flex items-center px-4 py-2 rounded-lg",
                  "text-sm font-medium text-white bg-indigo-600",
                  "hover:bg-indigo-700 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                )}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Detail
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    "grid grid-cols-3 gap-4 p-6 rounded-lg relative",
                    "bg-gray-50 border border-gray-100",
                    "transition-all duration-200 hover:shadow-md"
                  )}
                >
                  <Input
                    label="Value"
                    {...register(`details.${index}.value` as const, {
                      required: "Value is required",
                    })}
                    error={errors.details?.[index]?.value?.message}
                  />

                  <Input
                    label="Description"
                    {...register(`details.${index}.description` as const)}
                    error={errors.details?.[index]?.description?.message}
                  />

                  <Input
                    label="Max Limit"
                    type="number"
                    {...register(`details.${index}.maxLimit` as const, {
                      required: "Max limit is required",
                      min: { value: 0, message: "Must be positive" },
                    })}
                    error={errors.details?.[index]?.maxLimit?.message}
                  />

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute -right-2 -top-2 p-2 bg-white rounded-full shadow-md 
                               hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={mutation.isPending || isUploading}
            className={cn(
              "flex items-center px-6 py-2.5 rounded-lg",
              "text-white bg-indigo-600 font-medium",
              "hover:bg-indigo-700 transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
              (mutation.isPending || isUploading) &&
                "opacity-50 cursor-not-allowed"
            )}
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Payment Type"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
