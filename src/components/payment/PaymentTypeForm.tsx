/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import {
  CreatePaymentTypeData,
  PaymentType,
  createPaymentType,
  getPaymentMethods,
} from "../../network/services";
import { toast } from "react-hot-toast";
import { useState } from "react";
// import { cn } from "../../utils/utils";
import { Loader, Loader2, Plus, Trash2 } from "lucide-react";
import { Input } from "../ui/Input";

interface PaymentTypeFormProps {
  onSuccess?: () => void;
  initialData?: PaymentType | null;
}

export const PaymentTypeForm = ({
  onSuccess,
  initialData,
}: PaymentTypeFormProps) => {
  const { data: paymentMethods = [], isLoading: isLoadingMethods } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: getPaymentMethods,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePaymentTypeData>({
    defaultValues: initialData || {
      details: [{ value: "", description: "", maxLimit: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const mutation = useMutation({
    mutationFn: createPaymentType,
    onSuccess: () => {
      toast.success("Payment type saved successfully!");
      onSuccess?.();
    },
  });

  if (isLoadingMethods) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              {...register("paymentMethodId", {
                required: "Payment method is required",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

        {/* Details Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Payment Details</h4>
            <button
              type="button"
              onClick={() =>
                append({ value: "", description: "", maxLimit: 0 })
              }
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Detail
            </button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg relative"
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
                {...register(`details.${index}.description` as const, {
                  required: "Description is required",
                })}
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
                  className="absolute -right-2 -top-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
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
