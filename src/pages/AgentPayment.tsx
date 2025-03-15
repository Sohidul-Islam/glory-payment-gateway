import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAgentPaymentMethods,
  getAgentPaymentTypes,
  PaymentMethod,
  PaymentType,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  ChevronRight,
  CheckCircle2,
  XCircle,
  CreditCardIcon,
  
} from "lucide-react";

export const AgentPayment = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

  // Fetch payment methods
  const { data: paymentMethods, isLoading: methodsLoading } = useQuery({
    queryKey: ["agentPaymentMethods", agentId],
    queryFn: () => getAgentPaymentMethods(agentId!),
    enabled: !!agentId,
  });

  // Fetch payment types for selected method
  const { data: paymentTypes, isLoading: typesLoading } = useQuery({
    queryKey: ["agentPaymentTypes", selectedMethod, agentId],
    queryFn: () => getAgentPaymentTypes(selectedMethod!, agentId!),
    enabled: !!selectedMethod && !!agentId,
  });

  if (methodsLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Make Payment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Methods Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select Payment Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods?.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`bg-white rounded-xl p-4 border-2 transition-all ${
                  selectedMethod === method.id
                    ? "border-indigo-600 ring-2 ring-indigo-600 ring-opacity-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gray-100">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{method.name}</h3>
                      {method.status === "active" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Select for available payment options
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Types Section */}
        {selectedMethod && (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Payment Type
            </h2>
            <div className="space-y-3">
              {typesLoading ? (
                <div className="text-center py-8">
                  <Loader />
                </div>
              ) : (
                paymentTypes?.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => navigate(`/agent/${agentId}/payment/${selectedMethod}/${type.id}`)}
                    className="w-full bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <CreditCardIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-gray-900">{type.name}</h3>
                          <p className="text-sm text-gray-500">
                            Max limit: {Number(type.PaymentDetails[0]?.maxLimit).toLocaleString()} BDT
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 