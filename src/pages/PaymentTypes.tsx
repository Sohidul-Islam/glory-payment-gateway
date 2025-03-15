import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentType, getPaymentTypes, deletePaymentType } from "../network/services";
import { Modal } from "../components/ui/Modal";
import { Loader } from "../components/ui/Loader";
import { PlusIcon, Eye, Pencil, Trash2, ChevronDown, ChevronUp, Loader2, Settings } from "lucide-react";
import { formatDate } from "../utils/utils";
import { PaymentTypeForm } from "../components/payment/PaymentTypeForm";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

export const PaymentTypes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PaymentType | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const navigator = useNavigate();

  const { data: types = [], isLoading } = useQuery({
    queryKey: ["paymentTypes"],
    queryFn: getPaymentTypes,
  });

  

  const deleteMutation = useMutation({
    mutationFn: deletePaymentType,
    onSuccess: (data) => {

      if(data.status){
        queryClient.invalidateQueries({ queryKey: ["paymentTypes"] });
        toast.success("Payment type deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedType(null);
      }
      else{
        toast.error("Payment type can't be deleted");
      }
     
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete payment type");
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  const handleDelete = () => {
    if (selectedType?.id) {
      deleteMutation.mutate(selectedType.id);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

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

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((type: PaymentType) => (
          <div
            key={type.id}
            className="bg-white rounded-lg shadow-md overflow-hidden h-fit"
          >
            {/* Card Header */}
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={type.image}
                  alt={type.name}
                  className="h-auto w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {type.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        type.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {type.status}
                    </span>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {type.paymentMethodId}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
              <button
                onClick={() => toggleExpand(type.id)}
                className="text-sm font-medium text-gray-600 flex items-center gap-1 hover:text-gray-900"
              >
                {type.PaymentDetails?.length || 0} Details
                {expandedCard === type.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedType(type);
                    setIsModalOpen(true);
                  }}
                  className="p-1 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-50"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedType(type);
                    setIsFormModalOpen(true);
                  }}
                  className="p-1 text-blue-600 hover:text-blue-900 rounded-full hover:bg-blue-50"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedType(type);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expandable Details */}
            <div 
              className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                expandedCard === type.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-gray-200">
                {type.PaymentDetails?.map((detail) => (
                  <div
                    key={detail.id}
                    className="p-4 space-y-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Value
                      </span>
                      <span className="text-sm text-gray-900">{detail.value}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Description
                      </span>
                      <span className="text-sm text-gray-900">
                        {detail.description}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Max Limit
                      </span>
                      <span className="text-sm text-gray-900">
                        {Number(detail.maxLimit).toLocaleString()} BDT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Current Usage
                      </span>
                      <span className="text-sm text-gray-900">
                        {Number(detail.currentUsage).toLocaleString()} BDT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Status
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          detail.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {detail.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Created At
                      </span>
                      <span className="text-sm text-gray-900">
                        {formatDate(detail.createdAt)}
                      </span>
                    </div>

                    <div className="flex bg-gray-200 p-2 rounded-md justify-between items-center cursor-pointer" onClick={()=>{
                      navigator(`/payment-details/${detail?.id}`)
                    }}>
                      <span className="text-sm font-medium text-gray-600">
                        Configure
                      </span>
                      <span className="text-sm text-gray-900">
                        <button>
                        <Settings className="w-5 h-5" />
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
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
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    Created on {formatDate(selectedType.createdAt)}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedType.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedType.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Payment Details</h4>
              <div className="grid grid-cols-1 gap-4">
                {selectedType.PaymentDetails?.map((detail) => (
                  <div
                    key={detail.id}
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
                        {Number(detail.maxLimit).toLocaleString()} BDT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Current Usage</span>
                      <span className="text-sm">
                        {Number(detail.currentUsage).toLocaleString()} BDT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          detail.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {detail.isActive ? "Active" : "Inactive"}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedType(null);
        }}
        title="Delete Payment Type"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the payment type "{selectedType?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedType(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
