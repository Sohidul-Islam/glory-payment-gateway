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
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export const AgentPaymentMethods = () => {
  const { agentId, methodId } = useParams();
  const navigate = useNavigate();

  const { data: methods, isLoading: isLoadingMethods } = useQuery({
    queryKey: ["agentPaymentMethods", agentId],
    queryFn: () => getAgentPaymentMethods(agentId!),
    enabled: !!agentId,
  });

  const { data: types, isLoading: isLoadingTypes } = useQuery({
    queryKey: ["agentPaymentTypes", methodId, agentId],
    queryFn: () => getAgentPaymentTypes(Number(methodId), agentId!),
    enabled: !!agentId,
  });

  console.log({ types, methods });

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
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {(methods || [])?.map((method: PaymentMethod, index: number) => (
          <motion.button
            key={method.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.05,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.05,
              rotate: [0, -2, 2, -1, 1, 0],
              transition: { duration: 0.3 },
            }}
            onClick={() => navigate(`/payment/${agentId}/method/${method.id}`)}
            className="group relative bg-white rounded-lg border border-gray-200 p-3 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            <div className="absolute -top-0.5 -right-0.5 w-6 h-6 bg-indigo-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

            <div className="relative flex flex-col items-center text-center">
              {/* Payment Method Icon */}
              <div className="relative mb-2">
                <motion.div
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-50 flex items-center justify-center overflow-hidden p-2 transition-transform duration-300 group-hover:scale-110 shadow-sm"
                  whileHover={{
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <img
                    src={method.image}
                    alt={method.name}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <motion.div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    method.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                  animate={{
                    scale: [1, 1.2, 1],
                    transition: { duration: 1.5, repeat: Infinity },
                  }}
                >
                  {method.status === "active" ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  ) : (
                    <XCircle className="w-2.5 h-2.5 text-white" />
                  )}
                </motion.div>
              </div>

              {/* Payment Method Details */}
              <div className="space-y-1">
                <motion.h3
                  className="text-xs font-medium text-gray-900 truncate max-w-[100px]"
                  whileHover={{ scale: 1.05 }}
                >
                  {method.name.replace("_", " ")}
                </motion.h3>
                <motion.span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                    method.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  animate={{
                    scale: [1, 1.05, 1],
                    transition: { duration: 2, repeat: Infinity },
                  }}
                >
                  {method.status}
                </motion.span>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>
          </motion.button>
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
