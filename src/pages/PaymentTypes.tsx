import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaymentType, getPaymentTypes } from "../network/services";
import { Modal } from "../components/ui/Modal";
import { Loader } from "../components/ui/Loader";
import { PlusIcon, Eye, Pencil } from "lucide-react";
import { formatDate } from "../utils/utils";
import { PaymentTypeForm } from "../components/payment/PaymentTypeForm";

export const PaymentTypes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PaymentType | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { data: types = [], isLoading } = useQuery({
    queryKey: ["paymentTypes"],
    queryFn: getPaymentTypes,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Payment Types</h1>
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Type
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {types.map((type: PaymentType) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={type.image}
                          alt={type.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {type.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {type.paymentMethodId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {type.details.length} details
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(type.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedType(type);
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedType(type);
                        setIsFormModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedType(null);
        }}
        title={`Payment Type Details - ${selectedType?.name}`}
        size="lg"
      >
        {selectedType && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={selectedType.image}
                alt={selectedType.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-medium">{selectedType.name}</h3>
                <p className="text-sm text-gray-500">
                  Created on {formatDate(selectedType.createdAt)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Payment Details</h4>
              <div className="grid grid-cols-1 gap-4">
                {selectedType.details.map((detail, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Value</span>
                      <span className="text-sm">{detail.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Description</span>
                      <span className="text-sm">{detail.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Max Limit</span>
                      <span className="text-sm">
                        {detail.maxLimit.toLocaleString()} BDT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedType(null);
        }}
        title={selectedType ? "Edit Payment Type" : "Create Payment Type"}
        size="xl"
      >
        <PaymentTypeForm
          onSuccess={() => {
            setIsFormModalOpen(false);
            setSelectedType(null);
          }}
          initialData={selectedType}
        />
      </Modal>
    </div>
  );
};
