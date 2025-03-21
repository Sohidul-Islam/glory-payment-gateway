import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAgentPaymentDetails,
  PaymentDetailResponse,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import { motion } from "framer-motion";
import { CreditCard, User, Building2, ArrowRight, Wallet } from "lucide-react";
import { useState } from "react";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const AgentPaymentDetails = () => {
  const { agentId } = useParams();
  const [searchParams] = useSearchParams();
  const paymentTypeId = searchParams.get("type");
  const detailsId = searchParams.get("detailsId");

  const { data, isLoading } = useQuery({
    queryKey: ["paymentDetails", agentId, paymentTypeId],
    queryFn: () =>
      getAgentPaymentDetails({
        agentId: agentId as string,
        paymentTypeId: detailsId ? Number(paymentTypeId) : undefined,
        detailsId: Number(detailsId) || undefined,
      }),
    enabled: !!agentId,
  });

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-gray-500">No payment details found</div>
      </div>
    );
  }

  const paymentDetails = data as PaymentDetailResponse["data"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Details
            </h1>
            <p className="text-gray-500 mt-1">
              Complete your payment transaction
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Agent and Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Agent Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                    <User className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {paymentDetails?.agent.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Agent ID: {paymentDetails?.agent.agentId}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {paymentDetails?.paymentMethod.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {paymentDetails?.paymentType.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Account Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Account Details
                    </h3>
                    <p className="text-sm text-gray-500">
                      {paymentDetails?.account.accountNumber} -{" "}
                      {paymentDetails?.account.branchName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Available Limit</p>
                  <p className="text-lg font-semibold text-green-600">
                    ৳{paymentDetails?.account.availableLimit}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Amount Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Amount
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Wallet className="w-4 h-4" />
                  <span>Max: ৳{paymentDetails?.account.maxLimit}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      selectedAmount === amount
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    ৳{amount}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="Enter custom amount"
                  className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2">
                  Pay Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPaymentDetails;
