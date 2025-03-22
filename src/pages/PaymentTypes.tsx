import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PaymentType,
  getPaymentTypes,
  deletePaymentType,
} from "../network/services";
import { Modal } from "../components/ui/Modal";
import { Loader } from "../components/ui/Loader";
import {
  PlusIcon,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Settings,
} from "lucide-react";
import { formatDate } from "../utils/utils";
import { PaymentTypeForm } from "../components/payment/PaymentTypeForm";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const PaymentTypes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PaymentType | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const navigator = useNavigate();

  const { data: types = [], isLoading } = useQuery({
    queryKey: ["paymentTypes"],
    queryFn: getPaymentTypes,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePaymentType,
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ["paymentTypes"] });
        toast.success("Payment type deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedType(null);
      } else {
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
        <h1 className="text-lg md:text-2xl font-semibold">Payment Types</h1>
        {user?.accountType === "super admin" && (
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="btn-primary px-2 py-1  flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Type
          </button>
        )}
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((type: PaymentType) => (
          <div
            key={type.id}
            onClick={() => {
              if (type?.PaymentMethod?.name !== "MOBILE_BANKING") {
                navigator(`/payment-details/${type.name}/${type.id}`);
              }
            }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
          >
            {/* Card Header */}
            <div className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center space-x-4 relative">
                <div className="relative">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="h-16 w-16 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                      type.status === "active"
                        ? "bg-green-400 ring-2 ring-white"
                        : "bg-red-400 ring-2 ring-white"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                      {type.name}
                    </h3>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                        type.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {type.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      {type.PaymentMethod?.name?.replace("_", " ")}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      {type.paymentMethodId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="px-6 py-4 bg-gray-50/50 flex justify-between items-center border-t border-gray-100">
              {type?.PaymentMethod?.name === "MOBILE_BANKING" ? (
                <button
                  onClick={() => toggleExpand(type.id)}
                  className="text-sm font-medium text-gray-600 flex items-center gap-1.5 hover:text-indigo-600 transition-colors duration-200"
                >
                  <span className="flex items-center gap-1">
                    {type.PaymentDetails?.length || 0} Details
                    {expandedCard === type.id ? (
                      <ChevronUp className="w-4 h-4 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    )}
                  </span>
                </button>
              ) : (
                <span></span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedType(type);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-indigo-600 hover:text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
                {user?.accountType === "super admin" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedType(type);
                        setIsFormModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedType(type);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Expandable Details */}
            {type?.PaymentMethod?.name === "MOBILE_BANKING" && (
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedCard === type.id
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border-t border-gray-100">
                  {type.PaymentDetails?.map((detail) => (
                    <div
                      key={detail.id}
                      className="p-4 space-y-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Name
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {detail.value}
                        </span>
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
                        <span className="text-sm font-semibold text-gray-900">
                          {Number(detail.maxLimit).toLocaleString()} BDT
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Charge
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {Number(detail.charge).toLocaleString()}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Current Usage
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {Number(detail.currentUsage).toLocaleString()} BDT
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Status
                        </span>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            detail.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
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

                      <div
                        className="flex bg-white p-3 rounded-lg justify-between items-center cursor-pointer hover:bg-indigo-50/50 transition-colors duration-200 border border-gray-100"
                        onClick={() =>
                          navigator(`/payment-details/${detail?.id}`)
                        }
                      >
                        <span className="text-sm font-medium text-gray-700">
                          Configure
                        </span>
                        <span className="text-indigo-600">
                          <Settings className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <div className="flex-1">
                <h3 className="text-lg font-medium">{selectedType.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500">
                    Created on {formatDate(selectedType?.createdAt)}
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
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <span className="text-sm font-medium text-indigo-700">
                      {selectedType.PaymentMethod?.name?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span className="text-sm font-medium text-purple-700">
                      ID: {selectedType.paymentMethodId}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedType?.PaymentMethod?.name === "MOBILE_BANKING" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Payment Details</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Total Details:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedType.PaymentDetails?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {selectedType.PaymentDetails?.map((detail) => (
                    <div
                      key={detail.id}
                      className="bg-gray-50 p-4 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Name</span>
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
                        <span className="text-sm font-medium">Charge</span>
                        <span className="text-sm">
                          {Number(detail.charge).toLocaleString()}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          Current Usage
                        </span>
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

                      <div
                        className="flex bg-white p-3 rounded-lg justify-between items-center cursor-pointer hover:bg-indigo-50/50 transition-colors duration-200 border border-gray-100"
                        onClick={() =>
                          navigator(`/payment-details/${detail?.id}`)
                        }
                      >
                        <span className="text-sm font-medium text-gray-700">
                          Configure
                        </span>
                        <span className="text-indigo-600">
                          <Settings className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            Are you sure you want to delete the payment type "
            {selectedType?.name}"? This action cannot be undone.
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
