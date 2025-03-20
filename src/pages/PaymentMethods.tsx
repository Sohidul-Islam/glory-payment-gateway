import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "@heroicons/react/24/outline";
import noImage from "../assets/no-image-overlay.webp";
import { getPaymentMethods, PaymentMethod } from "../network/services";
import { useState } from "react";
import { PaymentMethodForm } from "../components/payment/PaymentMethodForm";
import { toast } from "react-hot-toast";
import { Modal } from "../components/ui/Modal";
import { cn } from "../utils/utils";
import { Loader } from "../components/ui/Loader";
import { useAuth } from "../hooks/useAuth";

const PaymentMethods = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<
    number | undefined
  >();
  const queryClient = useQueryClient();

  const { user } = useAuth();

  console.log({ user });

  const { data: methods = [], isLoading } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: getPaymentMethods,
  });

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedMethodId(undefined);
    queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    toast.success(
      selectedMethodId
        ? "Payment method updated successfully"
        : "Payment method added successfully"
    );
  };

  const handleEdit = (id: number) => {
    setSelectedMethodId(id);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between flex-wrap items-center">
        <h1 className="text-lg md:text-2xl font-semibold">Payment Methods</h1>
        {user?.accountType === "super admin" && (
          <button
            onClick={() => {
              setSelectedMethodId(undefined);
              setIsModalOpen(true);
            }}
            className="btn-primary px-2 py-1  flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Method
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
        {methods.map((method: PaymentMethod) => (
          <div
            key={method.id}
            className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -top-2 -right-2 w-6 sm:w-8 h-6 sm:h-8 bg-indigo-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

            <div className="flex flex-col items-center text-center relative">
              <div className="relative mb-1.5 sm:mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center mb-0.5 sm:mb-1">
                  <img
                    src={method.image || noImage}
                    alt={method.name}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = noImage;
                    }}
                  />
                </div>
                <span
                  className={cn(
                    "absolute -top-0.5 -right-0.5 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full",
                    method.status === "active"
                      ? "bg-green-400 ring-1 sm:ring-2 ring-green-100 animate-pulse"
                      : "bg-gray-400 ring-1 sm:ring-2 ring-gray-100"
                  )}
                />
              </div>
              <h3 className="font-medium text-[10px] sm:text-xs text-gray-700 mb-0.5 line-clamp-1">
                {method.name.replace("_", " ")}
              </h3>
              <span
                className={cn(
                  "text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full font-medium",
                  method.status === "active"
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-50 text-gray-600"
                )}
              >
                {method.status}
              </span>
            </div>
            {user?.accountType === "super admin" && (
              <div className="mt-1.5 sm:mt-2 flex justify-center cursor-pointer">
                <button
                  onClick={() => {
                    handleEdit(method.id);
                  }}
                  className="text-[8px] z-10 sm:text-[10px] px-2 sm:px-2.5 py-1 sm:py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 active:bg-indigo-200 transition-colors duration-200 font-medium touch-manipulation"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMethodId(undefined);
        }}
        title={selectedMethodId ? "Edit Payment Method" : "Add Payment Method"}
        size="md"
        position="center"
      >
        <PaymentMethodForm
          onSuccess={handleSuccess}
          methodId={selectedMethodId}
        />
      </Modal>
    </div>
  );
};

export default PaymentMethods;
