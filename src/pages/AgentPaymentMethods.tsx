import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAgentPaymentMethods,
  getAgentPaymentTypes,
  getAgentInfo,
  PaymentMethod,
  PaymentType,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import { ArrowLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AgentInfo } from "../components/AgentInfo";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const TransactionTypeSelector: React.FC<{
  selectedType: "withdraw" | "deposit" | null;
  onTypeSelect: (type: "withdraw" | "deposit") => void;
}> = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Select Transaction Type
        </h2>
        <p className="text-sm text-gray-500">Choose your transaction type</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
        {/* Withdraw Option */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.button
            onClick={() => onTypeSelect("withdraw")}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
              selectedType === "withdraw"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-300 text-white shadow-lg shadow-blue-500/20"
                : "bg-white hover:bg-blue-50 border-gray-100 hover:border-blue-200 hover:shadow-md"
            }`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedType === "withdraw"
                    ? "bg-white/20 backdrop-blur-sm"
                    : "bg-blue-50"
                }`}
              >
                <ArrowUpTrayIcon
                  className={`w-6 h-6 ${
                    selectedType === "withdraw" ? "text-white" : "text-blue-500"
                  }`}
                />
              </div>
              <div className="space-y-0.5 text-center">
                <h3 className="text-base font-semibold">Withdraw</h3>
                <p
                  className={`text-xs ${
                    selectedType === "withdraw"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  Send money out
                </p>
              </div>
            </div>
          </motion.button>
          {selectedType === "withdraw" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg shadow-blue-500/20">
                Withdraw ↑
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Deposit Option */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.button
            onClick={() => onTypeSelect("deposit")}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
              selectedType === "deposit"
                ? "bg-gradient-to-br from-green-500 to-green-600 border-green-300 text-white shadow-lg shadow-green-500/20"
                : "bg-white hover:bg-green-50 border-gray-100 hover:border-green-200 hover:shadow-md"
            }`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedType === "deposit"
                    ? "bg-white/20 backdrop-blur-sm"
                    : "bg-green-50"
                }`}
              >
                <ArrowDownTrayIcon
                  className={`w-6 h-6 ${
                    selectedType === "deposit" ? "text-white" : "text-green-500"
                  }`}
                />
              </div>
              <div className="space-y-0.5 text-center">
                <h3 className="text-base font-semibold">Deposit</h3>
                <p
                  className={`text-xs ${
                    selectedType === "deposit"
                      ? "text-green-100"
                      : "text-gray-500"
                  }`}
                >
                  Add money in
                </p>
              </div>
            </div>
          </motion.button>
          {selectedType === "deposit" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg shadow-green-500/20">
                Deposit ↓
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// const WithdrawDetailsSection: React.FC<{
//   accountNumber: string;
//   description: string;
//   onAccountNumberChange: (value: string) => void;
//   onDescriptionChange: (value: string) => void;
// }> = ({
//   accountNumber,
//   description,
//   onAccountNumberChange,
//   onDescriptionChange,
// }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="mb-8 max-w-2xl mx-auto"
//     >
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="p-4 sm:p-6 space-y-4">
//           <div className="flex items-center gap-3 text-blue-600 mb-2">
//             <ArrowUpTrayIcon className="w-5 h-5" />
//             <h3 className="font-semibold">Withdrawal Details</h3>
//           </div>

//           {/* Account Number Input */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Account Number *
//             </label>
//             <div className="relative group">
//               <input
//                 type="text"
//                 value={accountNumber}
//                 onChange={(e) => onAccountNumberChange(e.target.value)}
//                 placeholder="Enter your account number"
//                 className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
//                 required
//               />
//               <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//             </div>
//             <p className="text-xs text-gray-500">
//               This account number will be used to receive your funds
//             </p>
//           </div>

//           {/* Description Input */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <div className="relative group">
//               <textarea
//                 value={description}
//                 onChange={(e) => onDescriptionChange(e.target.value)}
//                 placeholder="Add any additional information about this withdrawal"
//                 rows={3}
//                 className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
//               />
//               <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//             </div>
//             <p className="text-xs text-gray-500">
//               Optional: Add any notes or special instructions
//             </p>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

export const AgentPaymentMethods = () => {
  const { agentId, methodId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<PaymentType | null>(null);
  const [transactionType, setTransactionType] = useState<
    "withdraw" | "deposit" | null
  >(
    (searchParams.get("transactionType") as "withdraw" | "deposit" | null) ||
      null
  );

  // const [accountNumber, setAccountNumber] = useState("");
  // const [withdrawDescription, setWithdrawDescription] = useState("");

  const { data: agentInfo, isLoading: isLoadingAgent } = useQuery({
    queryKey: ["agentInfo", agentId],
    queryFn: () => getAgentInfo(agentId!),
    enabled: !!agentId,
  });

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

  const handleTransactionTypeSelect = (type: "withdraw" | "deposit") => {
    setTransactionType(type);
    setSelectedMethod(null);
    setSelectedType(null);
    setSearchParams({ transactionType: type });
  };

  if (isLoadingMethods || isLoadingTypes || isLoadingAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader />
      </div>
    );
  }

  const renderMethods = () => (
    <div className="space-y-6">
      {/* Transaction Type Selector */}
      <TransactionTypeSelector
        selectedType={transactionType}
        onTypeSelect={handleTransactionTypeSelect}
      />

      {/* Only show the rest of the content if transaction type is selected */}
      {transactionType && (
        <>
          {/* Agent Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AgentInfo
              name={agentInfo?.fullName || ""}
              status={agentInfo?.status || ""}
              phone={agentInfo?.phone || ""}
              email={agentInfo?.email || ""}
              agentId={agentInfo?.agentId || ""}
              image={agentInfo?.image}
              className="mb-8"
            />
          </motion.div>

          {/* Withdraw Details Section */}
          {/* {transactionType === "withdraw" && (
            <WithdrawDetailsSection
              accountNumber={accountNumber}
              description={withdrawDescription}
              onAccountNumberChange={setAccountNumber}
              onDescriptionChange={setWithdrawDescription}
            />
          )} */}

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
                        method.status === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
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
                      className="text-xs font-medium text-wrap text-gray-900 truncate max-w-[100px]"
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
                    ?.filter(
                      (type) => type.paymentMethodId === selectedMethod.id
                    )
                    .map((type, index) => (
                      <motion.div
                        key={type.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`group relative bg-white rounded-xl border p-4 hover:shadow-lg transition-all duration-300 ${
                          selectedType?.id === type.id
                            ? "border-indigo-500 shadow-lg"
                            : "border-gray-200 hover:border-indigo-500"
                        }`}
                      >
                        {/* Decorative background elements */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 rounded-xl ${
                            selectedType?.id === type.id
                              ? "opacity-100"
                              : "group-hover:opacity-100"
                          }`}
                        />
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-indigo-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                        <div
                          className="relative flex items-center gap-4 cursor-pointer"
                          onClick={() => {
                            if (type) {
                              setSelectedType(type);
                              if (type?.PaymentDetails?.length <= 0) {
                                navigate(
                                  `/payment/${agentId}/make-payment?method=${selectedMethod?.id}&type=${type.id}&transactionType=${transactionType}`
                                );
                              }
                            }
                          }}
                        >
                          <div className="relative">
                            <motion.div
                              className="w-14 h-14 rounded-xl bg-gradient-to-br from-white to-gray-50 flex items-center justify-center overflow-hidden p-2.5 shadow-sm"
                              whileHover={{
                                scale: 1.1,
                                rotate: [0, -5, 5, 0],
                                transition: { duration: 0.3 },
                              }}
                            >
                              <img
                                src={type.image}
                                alt={type.name}
                                className="w-full h-full object-contain"
                              />
                            </motion.div>
                            <motion.div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                type.status === "active"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              animate={{
                                scale: [1, 1.2, 1],
                                transition: { duration: 1.5, repeat: Infinity },
                              }}
                            >
                              {type.status === "active" ? (
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              ) : (
                                <XCircle className="w-3 h-3 text-white" />
                              )}
                            </motion.div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
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
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Details Section */}
          {selectedType && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment Options
                  </h3>
                  <p className="text-gray-500">
                    Choose your preferred payment option
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedType?.PaymentDetails.map((detail, detailIndex) => (
                    <motion.button
                      key={detail.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: detailIndex * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        navigate(
                          `/payment/${agentId}/make-payment?method=${selectedMethod?.id}&type=${detail.paymentTypeId}&detailsId=${detail.id}&transactionType=${transactionType}`
                        );
                      }}
                      className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
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
                              Max Limit:{" "}
                              {Number(detail.maxLimit).toLocaleString()} BDT
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
              </motion.div>
            </AnimatePresence>
          )}
        </>
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
