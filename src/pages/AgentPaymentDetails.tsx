import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAgentSinglePaymentType,
  getPaymentDetailInfo,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import {
  ArrowLeft,
  DollarSign,
  Info,
  CheckCircle2,
  XCircle,
  Phone,
} from "lucide-react";

export const AgentPaymentDetails = () => {
  const { agentId, typeId, detailsId } = useParams();

  const navigate = useNavigate();

  // Query for payment type details
  const { data: paymentType, isLoading: isLoadingType } = useQuery({
    queryKey: ["agentPaymentType", typeId, agentId],
    queryFn: () => getAgentSinglePaymentType(Number(typeId), agentId!),
    enabled: !!typeId && !!agentId && !detailsId,
  });

  // Query for payment details when detailsId is available
  const { data: paymentDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["paymentDetails", detailsId],
    queryFn: () => getPaymentDetailInfo(Number(detailsId)),
    enabled: !!detailsId,
  });

  const isLoading = isLoadingType || isLoadingDetails;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader />
      </div>
    );
  }

  // Handle not found cases
  if ((!paymentType && !detailsId) || (!paymentDetails && detailsId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Payment Details Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The payment information you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get the appropriate payment detail based on the available data
  const paymentDetail = detailsId
    ? paymentDetails?.paymentMethod
    : paymentType?.PaymentDetails && paymentType.PaymentDetails.length > 0
    ? paymentType.PaymentDetails[0]
    : undefined;

  // Get the payment type information
  const currentPaymentType = detailsId
    ? paymentDetails?.paymentMethod.PaymentType
    : paymentType;

  // Get available account numbers that are active and haven't exceeded their limit
  const availableAccounts =
    paymentDetails?.accountInfo?.filter(
      (account) =>
        account.isActive &&
        account.status === "active" &&
        Number(account.currentUsage) < Number(account.maxLimit)
    ) || [];

  const selectedAccount =
    availableAccounts.length > 0 ? availableAccounts[0] : null;

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
                Payment Details
              </h1>
              <p className="text-sm text-gray-500">
                Complete your payment securely
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Type Info */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden p-3">
                <img
                  src={currentPaymentType?.image}
                  alt={currentPaymentType?.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentPaymentType?.name}
                  </h2>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      currentPaymentType?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentPaymentType?.status === "active" ? (
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1 inline" />
                    )}
                    {currentPaymentType?.status}
                  </span>
                </div>
                {paymentDetail?.value && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {paymentDetail.value}
                    </span>
                  </div>
                )}
                {paymentDetail?.description && (
                  <p className="mt-2 text-gray-600">
                    {paymentDetail.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Max Limit</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {Number(paymentDetail?.maxLimit).toLocaleString()} BDT
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Current Usage
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {Number(paymentDetail?.currentUsage).toLocaleString()} BDT
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Payment Form */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Make Payment</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">BDT</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={selectedAccount?.accountNumber || ""}
                  readOnly
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              {selectedAccount && (
                <p className="mt-2 text-sm text-gray-500">
                  Max Limit: {Number(selectedAccount.maxLimit).toLocaleString()}{" "}
                  BDT | Current Usage:{" "}
                  {Number(selectedAccount.currentUsage).toLocaleString()} BDT
                </p>
              )}
              {!selectedAccount && (
                <p className="mt-2 text-sm text-red-500">
                  No available account numbers found or all accounts have
                  reached their limits.
                </p>
              )}
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Payment Information
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Minimum amount: 10 BDT</li>
                      <li>
                        Maximum amount:{" "}
                        {Number(paymentDetail?.maxLimit).toLocaleString()} BDT
                      </li>
                      <li>
                        {paymentDetail?.description ||
                          "Transaction fee may apply"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
