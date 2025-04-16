import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAgentPaymentDetails,
  PaymentDetailResponse,
  submitPayment,
  PaymentSubmissionData,
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
  Clock,
  ArrowUpFromLine,
  ArrowDownFromLine,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AgentInfo } from "../components/AgentInfo";
import { toast } from "react-toastify";
import { uploadFile } from "../utils/utils";
import { useAlert } from "../contexts/AlertContext";
import ImportantNotice, { PaymentType } from "../components/ImportantNotice";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const OPTIONS = [
  { value: "player", label: "Player" },
  { value: "agent", label: "Agent" },
  { value: "product", label: "Product/Item" },
];

// Add this new component before AgentPaymentDetails
const WithdrawDetailsSection: React.FC<{
  accountNumber: string;
  description: string;
  onAccountNumberChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}> = ({
  accountNumber,
  description,
  onAccountNumberChange,
  onDescriptionChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-3 text-blue-600 mb-2">
          <ArrowUpFromLine className="w-5 h-5" />
          <h3 className="font-semibold">Withdrawal Details</h3>
        </div>

        {/* Account Number Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Account Number *
          </label>
          <div className="relative group">
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => onAccountNumberChange(e.target.value)}
              placeholder="Enter your account number"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              required
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-500">
            This account number will be used to receive your funds
          </p>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="relative group">
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Add any additional information about this withdrawal"
              rows={3}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-500">
            Optional: Add any notes or special instructions
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const AgentPaymentDetails = () => {
  const { agentId } = useParams();
  const { showAlert } = useAlert();
  const [searchParams] = useSearchParams();
  const paymentTypeId = searchParams.get("type");
  const detailsId = searchParams.get("detailsId");
  const paymentType = searchParams.get("paymentType");
  const transactionType = searchParams.get("transactionType");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRouting, setCopiedRouting] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [optionId, setOptionId] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const navigate = useNavigate();

  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    null
  );

  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      window.location.reload();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["paymentDetails", agentId, paymentTypeId],
    queryFn: () =>
      getAgentPaymentDetails({
        agentId: agentId as string,
        paymentTypeId: paymentTypeId ? Number(paymentTypeId) : undefined,
        // paymentTypeId: detailsId ? Number(paymentTypeId) : undefined,
        detailsId: Number(detailsId) || undefined,
        transactionType: transactionType as string,
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

  // Add mutation for payment submission
  const { mutate: submitPaymentMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: submitPayment,
      onSuccess: (response) => {
        if (response?.status) {
          toast.success(
            "Payment submitted successfully. Please wait for approval."
          );

          showAlert(
            "Payment submitted successfully. Please wait for approval.",
            "success"
          );

          navigate(`/payment/${agentId}?paymentType=${paymentType}`);

          // window.location.reload();
        } else {
          toast.error(
            (response as unknown as { message: string }).message ||
              "Payment submission failed"
          );

          showAlert("Payment submission failed", "error");
        }
        // Handle success - you can add a success notification or redirect
        console.log("Payment submitted successfully:", response);
      },
      onError: (error) => {
        // Handle error - you can add an error notification
        toast.error(
          error.message || (error as unknown as { error: string }).error
        );

        showAlert("Payment submission failed", "error");

        console.error("Payment submission failed:", error);
      },
    });

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!selectedAmount && !customAmount) {
      toast.error("Please select an amount");
      return;
    }

    if (!transactionNumber && transactionType === "deposit") {
      toast.error("Please enter transaction number");
      return;
    }

    if (!selectedOption || !optionId) {
      toast.error("Please select an option");
      return;
    }

    // Add validation for withdraw transaction
    if (transactionType === "withdraw" && !withdrawAccountNumber.trim()) {
      toast.error("Please enter your account number for withdrawal");
      return;
    }

    const amount = selectedAmount || parseFloat(customAmount);
    const imageUrl = attachment ? await uploadFile(attachment) : "";

    // Create payment data object
    const paymentData: PaymentSubmissionData = {
      agentId: agentId || "",
      paymentMethodId: paymentDetails?.paymentMethod.id || undefined,
      paymentTypeId: paymentDetails.paymentType?.id || undefined,
      paymentDetailId: paymentDetails.paymentDetail?.id || undefined,
      paymentAccountId: paymentDetails.account.id || undefined,
      transactionId: transactionNumber,
      attachment: imageUrl,
      paymentSource: selectedOption,
      paymentSourceId: optionId,
      type: transactionType === "withdraw" ? "withdraw" : "deposit",
      amount: amount,
      status: "pending",
      // Add withdrawal specific fields
      ...(transactionType === "withdraw"
        ? {
            withdrawAccountNumber: withdrawAccountNumber,
            withdrawDescription: withdrawDescription,
          }
        : {}),
    };

    // Submit payment
    submitPaymentMutation(paymentData);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Timer Banner */}
        <div className="mb-4 sm:mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              <span className="text-sm sm:text-base font-medium text-gray-900">
                Time Remaining
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-indigo-600">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Payment Details
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  Complete your payment transaction securely
                </p>
              </div>
              <div className="flex justify-center sm:justify-end">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Transaction Type Indicator */}
            <div className="flex items-center justify-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  transactionType === "withdraw"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {transactionType === "withdraw" ? (
                  <ArrowUpFromLine className="w-4 h-4" />
                ) : (
                  <ArrowDownFromLine className="w-4 h-4" />
                )}
                <span className="font-medium capitalize">
                  {transactionType} Transaction
                </span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
              {/* Agent & Payment Info */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
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
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center overflow-hidden shadow-sm">
                        {paymentDetails?.paymentMethod.image ? (
                          <img
                            src={paymentDetails.paymentMethod.image}
                            alt={paymentDetails.paymentMethod.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                          {paymentDetails?.paymentMethod.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {paymentDetails?.paymentType.name}
                        </p>
                      </div>
                    </div>

                    {/* Payment Details Grid */}
                    <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {paymentDetails?.paymentDetail.value && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 sm:p-4 border border-indigo-100 hover:shadow-md transition-shadow duration-200">
                          <p className="text-xs font-medium text-indigo-600">
                            Type
                          </p>
                          <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1">
                            {paymentDetails?.paymentDetail.value}
                          </p>
                        </div>
                      )}
                      {paymentDetails?.paymentDetail.charge && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 sm:p-4 border border-indigo-100 hover:shadow-md transition-shadow duration-200">
                          <p className="text-xs font-medium text-indigo-600">
                            Charge
                          </p>
                          <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1">
                            {paymentDetails?.paymentDetail.charge}%
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {paymentDetails?.paymentDetail.description && (
                      <div className="mt-4 bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                            <span className="text-xs sm:text-sm font-medium text-yellow-600">
                              !
                            </span>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-yellow-800">
                              Note
                            </p>
                            <p className="text-xs sm:text-sm text-yellow-700 mt-0.5">
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

            {/* Withdraw Details Section */}
            {transactionType === "withdraw" && (
              <WithdrawDetailsSection
                accountNumber={withdrawAccountNumber}
                description={withdrawDescription}
                onAccountNumberChange={setWithdrawAccountNumber}
                onDescriptionChange={setWithdrawDescription}
              />
            )}

            {/* Account & Transaction Grid */}
            {transactionType === "deposit" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Account Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                        Account Details
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          Active
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Branch: {paymentDetails?.account.branchName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 sm:space-y-3">
                    {/* Account Number */}
                    <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Account Number
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-gray-900 mt-0.5">
                            {paymentDetails?.account.accountNumber}
                          </p>
                        </div>
                        <button
                          onClick={handleCopyAccountNumber}
                          className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-full transition-colors"
                          title="Copy account number"
                        >
                          {copiedAccount ? (
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Routing Number */}
                    {paymentDetails?.account.routingNumber && (
                      <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Routing Number
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 mt-0.5">
                              {paymentDetails.account.routingNumber}
                            </p>
                          </div>
                          <button
                            onClick={handleCopyRoutingNumber}
                            className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-full transition-colors"
                            title="Copy routing number"
                          >
                            {copiedRouting ? (
                              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
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
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Transaction Details
                    </h3>

                    {/* Transaction Number */}
                    <div className="mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Transaction Number
                      </label>
                      <div className="flex gap-2 sm:gap-3">
                        <input
                          type="text"
                          value={transactionNumber}
                          onChange={(e) => setTransactionNumber(e.target.value)}
                          placeholder="Enter transaction number"
                          className="flex-1 p-2 sm:p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-colors text-sm"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(transactionNumber);
                          }}
                          className="p-2 sm:p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          title="Copy transaction number"
                        >
                          <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Attachment Upload */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Payment Receipt
                      </label>
                      <div className="space-y-2 sm:space-y-3">
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
                              className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1.5 sm:p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-indigo-500 transition-colors hover:bg-gray-50">
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
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-900">
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
            )}

            {/* Option Selection Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Select Option
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Option Type
                  </label>
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full p-2 sm:p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-colors text-sm"
                  >
                    <option value="">Select an option</option>
                    {OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    {selectedOption
                      ? `${
                          selectedOption.charAt(0).toUpperCase() +
                          selectedOption.slice(1)
                        } ID`
                      : "ID"}
                  </label>
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={optionId}
                      onChange={(e) => setOptionId(e.target.value)}
                      placeholder={`Enter ${selectedOption || "option"} ID`}
                      className="flex-1 p-2 sm:p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-colors text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(optionId);
                      }}
                      className="p-2 sm:p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      title="Copy ID"
                    >
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Amount Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Select Amount
                </h3>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Max: ৳{paymentDetails?.account.maxLimit}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount((prev) =>
                        prev ? prev + amount : amount
                      );
                      setCustomAmount("");
                    }}
                    className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:shadow-md text-sm sm:text-base ${
                      selectedAmount === amount
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    ৳{amount}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="number"
                  value={customAmount || selectedAmount?.toString()}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="Enter custom amount"
                  className="flex-1 p-3 sm:p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-colors text-sm"
                />
                <button
                  onClick={handlePaymentSubmit}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-base sm:text-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay Now
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Important Notice Section */}
            <ImportantNotice
              type={transactionType === "deposit" ? "deposit" : "withdraw"}
              paymentType={paymentDetails?.paymentMethod.name as PaymentType}
            />

            {/* {transactionType === "withdraw" && (
              <ImportantNotice type="withdraw" />
            )}
            {paymentDetails.paymentMethod.name === "bank" && (
              <ImportantNotice type="banking" />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPaymentDetails;
