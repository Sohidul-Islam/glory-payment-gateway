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
            <div className="grid grid-cols-1 md:grid-cols-1">
              {/* Agent Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl"
              >
                <AgentInfo
                  name={paymentDetails?.agent?.fullName || ""}
                  status={paymentDetails?.agent?.status || ""}
                  phone={paymentDetails?.agent?.phone || ""}
                  email={paymentDetails?.agent?.email || ""}
                  agentId={paymentDetails?.agent?.agentId || ""}
                  image={paymentDetails?.agent?.image}
                  className="mb-8"
                />
              </motion.div>

              {/* Payment Method Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
                    {paymentDetails?.paymentMethod.image ? (
                      <img
                        src={paymentDetails.paymentMethod.image}
                        alt={paymentDetails.paymentMethod.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <CreditCard className="w-8 h-8 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {paymentDetails?.paymentMethod.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {paymentDetails?.paymentType.name}
                      </p>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500">
                          Payment ID
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">
                          {paymentDetails?.paymentMethod.id}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500">
                          Type ID
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5">
                          {paymentDetails?.paymentType.id}
                        </p>
                      </div>
                    </div>

                    {/* Payment Detail Information */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-indigo-600">
                            Value
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            {paymentDetails?.paymentDetail.value}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-indigo-600">
                            Charge
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            ৳{paymentDetails?.paymentDetail.charge}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-indigo-600">
                            Max Limit
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            ৳{paymentDetails?.paymentDetail.maxLimit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-indigo-600">
                            Available
                          </p>
                          <p className="text-sm font-semibold text-green-600 mt-0.5">
                            ৳{paymentDetails?.paymentDetail.availableLimit}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {paymentDetails?.paymentDetail.description && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                            <span className="text-xs font-medium text-yellow-600">
                              !
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Note
                            </p>
                            <p className="text-sm text-gray-900 mt-0.5">
                              {paymentDetails.paymentDetail.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Account Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-4">
                    <div>
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

                    <div className="space-y-3">
                      {/* Account Number */}
                      <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
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
                        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
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
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Transaction Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Transaction Details
                </h3>
              </div>

              {/* Transaction Number */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={transactionNumber}
                    onChange={(e) => setTransactionNumber(e.target.value)}
                    placeholder="Enter transaction number"
                    className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transactionNumber);
                      // You can add a toast notification here
                    }}
                    className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    title="Copy transaction number"
                  >
                    <Copy className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Attachment Upload */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Receipt
                </label>
                <div className="space-y-3">
                  {attachmentPreview ? (
                    <div className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={attachmentPreview}
                          alt="Receipt preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        onClick={removeAttachment}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
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
