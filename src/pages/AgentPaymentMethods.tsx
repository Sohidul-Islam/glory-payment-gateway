import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAgentPaymentMethods,
  getAgentPaymentTypes,
  PaymentMethod,
  PaymentType,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import { ArrowLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const AgentPaymentMethods = () => {
  const { agentId, methodId } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );

  const [selectedType, setSelectedType] = useState<PaymentType | null>(null);

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
            onClick={() => {
              if (selectedMethod?.id !== method.id) {
                setSelectedMethod(method);
                setSelectedType(null);
              }
            }}
            className={`group relative bg-white rounded-lg border p-3 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              selectedMethod?.id === method.id
                ? "border-indigo-500 shadow-lg"
                : "border-gray-200 hover:border-indigo-500"
            }`}
          >
            {/* Decorative background elements */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 rounded-lg ${
                selectedMethod?.id === method.id
                  ? "opacity-100"
                  : "group-hover:opacity-100"
              }`}
            />
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

      {/* Associated Types Section */}
      <AnimatePresence>
        {selectedMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Available {selectedMethod.name.replace("_", " ")} Options
              </h3>
              <p className="text-gray-500">
                Select a payment type to proceed with your transaction
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {types
                ?.filter((type) => type.paymentMethodId === selectedMethod.id)
                .map((type, index) => (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className="flex items-center gap-4 mb-4"
                      onClick={() => {
                        if (type) setSelectedType(type);
                      }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden p-2">
                        <img
                          src={type.image}
                          alt={type.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {type.name}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            type.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {type.status}
                        </span>
                      </div>
                    </div>
                    {/*  */}
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {selectedType && (
        <AnimatePresence>
          <div className="space-y-3">
            {selectedType?.PaymentDetails.map((detail, detailIndex) => (
              <motion.button
                key={detail.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: detailIndex * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 },
                }}
                onClick={() =>
                  navigate(
                    `/payment/${agentId}/method/${selectedMethod?.id}/type/${detail.paymentTypeId}`
                  )
                }
                className="w-full group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-indigo-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                <div className="relative flex items-center gap-4">
                  {/* Payment Type Icon */}
                  <div className="relative">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-100 flex items-center justify-center overflow-hidden p-2 shadow-sm"
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 },
                      }}
                    >
                      <img
                        src={selectedType.image}
                        alt={selectedType.name}
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                    {detail.charge && (
                      <motion.div
                        className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        animate={{
                          scale: [1, 1.1, 1],
                          transition: {
                            duration: 1.5,
                            repeat: Infinity,
                          },
                        }}
                      >
                        {detail.charge}%
                      </motion.div>
                    )}
                  </div>

                  {/* Payment Type Details */}
                  <div className="flex-1 text-left">
                    <motion.h4
                      className="font-medium text-gray-900 mb-1"
                      whileHover={{ scale: 1.02 }}
                    >
                      {detail.value || "Default"}
                    </motion.h4>
                    {detail.maxLimit && (
                      <p className="text-xs text-gray-500">
                        Max Limit: {Number(detail.maxLimit).toLocaleString()}{" "}
                        BDT
                      </p>
                    )}
                  </div>

                  {/* Arrow Icon */}
                  <motion.div
                    className="text-gray-400"
                    animate={{
                      x: [0, 5, 0],
                      transition: { duration: 1.5, repeat: Infinity },
                    }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Payment Methods
              </h1>
              <p className="text-sm text-gray-500">
                Choose your payment method and type
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          {renderMethods()}
        </div>
      </div>
    </div>
  );
};
