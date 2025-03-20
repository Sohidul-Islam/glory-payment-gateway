import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateAccountData,
  createPaymentAccount,
  PaymentMethodType,
  updatePaymentAccount,
} from "../../network/services";
import { Input } from "../ui/Input";

import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface AccountFormProps {
  onSuccess?: () => void;
  paymentDetailId: number;
  paymentTypeId?: number;
  paymentMethod: PaymentMethodType;
  initialData?: {
    id: number;
    accountNumber: string;
    branchName?: string;
    routingNumber?: string;
    maxLimit: string;
    status: "active" | "inactive";
  } | null;
}

export const AccountForm = ({
  onSuccess,
  paymentMethod,
  paymentDetailId,
  paymentTypeId,
  initialData,
}: AccountFormProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountData>({
    defaultValues: {
      paymentDetailId,
      paymentTypeId,
      accountNumber: initialData?.accountNumber || "",
      routingNumber: initialData?.routingNumber || "",
      branchName: initialData?.branchName || "",
      maxLimit: initialData?.maxLimit || "",
      status: initialData?.status || "active",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateAccountData) => {
      if (initialData?.id) {
        return updatePaymentAccount(initialData.id, data);
      }
      return createPaymentAccount(data);
    },
    onSuccess: (data) => {
      if (data?.status) {
        queryClient.invalidateQueries({ queryKey: ["paymentDetail"] });
        toast.success(
          initialData
            ? "Account updated successfully"
            : "Account created successfully"
        );
        onSuccess?.();
      } else {
        toast.error("Operation failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Operation failed");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-6"
    >
      <Input
        label="Account Number"
        {...register("accountNumber", {
          required: "Account number is required",
        })}
        error={errors.accountNumber?.message}
      />
      {paymentMethod === "BANK" && (
        <>
          <Input
            label="Branch Name"
            {...register("branchName", {
              required: "Branch Name is required",
            })}
            error={errors.accountNumber?.message}
          />
          <Input
            label="Routing Number"
            {...register("routingNumber", {
              required: "Routing Number is required",
            })}
            error={errors.accountNumber?.message}
          />
        </>
      )}

      <Input
        label="Max Limit"
        type="number"
        {...register("maxLimit", {
          required: "Max limit is required",
          min: { value: 0, message: "Max limit must be positive" },
        })}
        error={errors.maxLimit?.message}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register("status")}
          className="mt-1 block border p-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {initialData ? "Updating..." : "Creating..."}
            </>
          ) : initialData ? (
            "Update Account"
          ) : (
            "Create Account"
          )}
        </button>
      </div>
    </form>
  );
};
