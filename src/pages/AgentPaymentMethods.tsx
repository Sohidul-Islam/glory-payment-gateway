import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAgentPaymentMethods,
  getAgentPaymentTypes,
  PaymentMethod,
  PaymentType,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import { ArrowLeft, ChevronRight, Info } from "lucide-react";

export const AgentPaymentMethods = () => {
  const { agentId, methodId } = useParams();
  const navigate = useNavigate();

  const { data: methods, isLoading: isLoadingMethods } = useQuery({
    queryKey: ["agentPaymentMethods", agentId],
    queryFn: () => getAgentPaymentMethods(agentId!),
    enabled: !!agentId && !methodId,
  });

  const { data: types, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["agentPaymentTypes", methodId, agentId],
    queryFn: () => getAgentPaymentTypes(Number(methodId), agentId!),
    enabled: !!methodId && !!agentId,
  });

  console.log({ methods, types });

  if (isLoadingMethods || isLoadingTypes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader />
      </div>
    );
  }

  const renderMethods = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Payment Method
        </h2>
        <p className="text-gray-500">
          Choose your preferred payment method to proceed
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(methods || [])?.map((method: PaymentMethod) => (
          <button
            key={method.id}
            onClick={() => navigate(`/payment/${agentId}/method/${method.id}`)}
            className="group relative w-full bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden p-3 transition-transform duration-300 group-hover:scale-110">
                <img
                  src={method.image}
                  alt={method.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {method.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Select for available payment options
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      method.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {method.status}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTypes = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Payment Type
        </h2>
        <p className="text-gray-500">
          Choose the specific payment type for your transaction
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {types?.map((type: PaymentType) => (
          <div
            key={type.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-indigo-500 hover:shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden p-3">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {type.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        type.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {type.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100">
              <div className="grid grid-cols-1 divide-y divide-gray-100">
                {type.PaymentDetails.map((detail) => (
                  <button
                    key={detail.id}
                    onClick={() => {
                      if (type?.PaymentDetails?.length) {
                        navigate(
                          `/payment/${agentId}/method/${methodId}/details/${detail.id}`
                        );
                        return;
                      }
                      navigate(
                        `/payment/${agentId}/method/${methodId}/type/${type.id}`
                      );
                    }}
                    className="group p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {detail.value}
                          </h4>
                          {detail.description && (
                            <span className="inline-flex items-center text-xs text-gray-500">
                              <Info className="w-3.5 h-3.5 mr-1" />
                              {detail.description}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            Max Limit:{" "}
                            {Number(detail.maxLimit).toLocaleString()} BDT
                          </span>
                          {Number(detail.currentUsage) > 0 && (
                            <span>
                              Usage:{" "}
                              {Number(detail.currentUsage).toLocaleString()} BDT
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                methodId ? navigate(`/payment/${agentId}`) : navigate(-1)
              }
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {methodId ? "Payment Types" : "Payment Methods"}
              </h1>
              <p className="text-sm text-gray-500">
                {methodId
                  ? "Select a payment type to proceed"
                  : "Choose your payment method"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          {methodId ? renderTypes() : renderMethods()}
        </div>
      </div>
    </div>
  );
};
