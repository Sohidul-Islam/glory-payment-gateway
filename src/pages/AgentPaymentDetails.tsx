import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAgentPaymentDetails,
  PaymentDetailResponse,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import { motion } from "framer-motion";
import {
  CreditCard,
  Building2,
  ArrowRight,
  Wallet,
  Copy,
  Check,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { AgentInfo } from "../components/AgentInfo";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const AgentPaymentDetails = () => {
  const { agentId } = useParams();
  const [searchParams] = useSearchParams();
  const paymentTypeId = searchParams.get("type");
  const detailsId = searchParams.get("detailsId");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRouting, setCopiedRouting] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    null
  );

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

  const handleCopyAccountNumber = async () => {
    if (data?.data?.account.accountNumber) {
      await navigator.clipboard.writeText(data.data.account.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleCopyRoutingNumber = async () => {
    if (data?.data?.account.routingNumber) {
      await navigator.clipboard.writeText(data.data.account.routingNumber);
      setCopiedRouting(true);
      setTimeout(() => setCopiedRouting(false), 2000);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
  };

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Payment Details
                </h1>
                <p className="text-gray-600 mt-2">
                  Complete your payment transaction securely
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              {/* Left Column - Agent & Payment Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Agent Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <AgentInfo
                    name={paymentDetails?.agent?.fullName || ""}
                    status={paymentDetails?.agent?.status || ""}
                    phone={paymentDetails?.agent?.phone || ""}
                    email={paymentDetails?.agent?.email || ""}
                    agentId={paymentDetails?.agent?.agentId || ""}
                    image={paymentDetails?.agent?.image}
                  />
                </motion.div>

                {/* Payment Method Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center overflow-hidden shadow-sm">
                        {paymentDetails?.paymentMethod.image ? (
                          <img
                            src={paymentDetails.paymentMethod.image}
                            alt={paymentDetails.paymentMethod.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <CreditCard className="w-8 h-8 text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {paymentDetails?.paymentMethod.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {paymentDetails?.paymentType.name}
                        </p>
                      </div>
                    </div>

                    {/* Payment Details Grid */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {paymentDetails?.paymentDetail.value && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100 hover:shadow-md transition-shadow duration-200">
                          <p className="text-xs font-medium text-indigo-600">
                            Type
                          </p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {paymentDetails?.paymentDetail.value}
                          </p>
                        </div>
                      )}
                      {paymentDetails?.paymentDetail.charge && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100 hover:shadow-md transition-shadow duration-200">
                          <p className="text-xs font-medium text-indigo-600">
                            Charge
                          </p>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            ৳{paymentDetails?.paymentDetail.charge}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {paymentDetails?.paymentDetail.description && (
                      <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                            <span className="text-sm font-medium text-yellow-600">
                              !
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-yellow-800">
                              Note
                            </p>
                            <p className="text-sm text-yellow-700 mt-0.5">
                              {paymentDetails.paymentDetail.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
            {/* Right Column - Account & Transaction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      Account Details
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        Active
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Branch: {paymentDetails?.account.branchName}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Account Number */}
                  <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Account Number
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">
                          {paymentDetails?.account.accountNumber}
                        </p>
                      </div>
                      <button
                        onClick={handleCopyAccountNumber}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                        title="Copy account number"
                      >
                        {copiedAccount ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Routing Number */}
                  {paymentDetails?.account.routingNumber && (
                    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Routing Number
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-0.5">
                            {paymentDetails.account.routingNumber}
                          </p>
                        </div>
                        <button
                          onClick={handleCopyRoutingNumber}
                          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                          title="Copy routing number"
                        >
                          {copiedRouting ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Transaction Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Transaction Details
                  </h3>

                  {/* Transaction Number */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Number
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={transactionNumber}
                        onChange={(e) => setTransactionNumber(e.target.value)}
                        placeholder="Enter transaction number"
                        className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-colors"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(transactionNumber);
                        }}
                        className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        title="Copy transaction number"
                      >
                        <Copy className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Attachment Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Receipt
                    </label>
                    <div className="space-y-3">
                      {attachmentPreview ? (
                        <div className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                            <img
                              src={attachmentPreview}
                              alt="Receipt preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <button
                            onClick={removeAttachment}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors hover:bg-gray-50">
                          <input
                            type="file"
                            id="attachment"
                            accept="image/*,.pdf"
                            onChange={handleAttachmentChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="attachment"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                              <Upload className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Upload Receipt
                              </p>
                              <p className="text-xs text-gray-500">
                                Drag and drop or click to upload
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Amount Selection - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Amount
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Wallet className="w-4 h-4" />
                  <span>Max: ৳{paymentDetails?.account.maxLimit}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      selectedAmount === amount
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    ৳{amount}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="Enter custom amount"
                  className="flex-1 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-colors"
                />
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2 text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200">
                  Pay Now
                  <ArrowRight className="w-5 h-5" />
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
