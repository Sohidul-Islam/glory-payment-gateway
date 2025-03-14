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

const PaymentMethods = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<
    number | undefined
  >();
  const queryClient = useQueryClient();

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Payment Methods</h1>
        <button
          onClick={() => {
            setSelectedMethodId(undefined);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Method
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((method: PaymentMethod) => (
          <div
            key={method.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={method.image || noImage}
                alt={method.name}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = noImage;
                }}
              />
              <div>
                <h3 className="font-medium">{method.name.replace("_", " ")}</h3>
                <span
                  className={cn(
                    "inline-block px-2 py-1 rounded-full text-xs",
                    method.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {method.status}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(method.id)}
                className="btn-primary text-sm"
              >
                Edit
              </button>
              {/* <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Configure
              </button> */}
            </div>
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
