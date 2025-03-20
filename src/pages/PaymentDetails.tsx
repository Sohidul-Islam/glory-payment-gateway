import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  PaymentDetailResponse,
  getPaymentDetailInfo,
  AccountInfo,
  getPaymentDetailInfoByTypeId,
} from "../network/services";
import { Loader } from "../components/ui/Loader";
import { Modal } from "../components/ui/Modal";
import { AccountForm } from "../components/payment/AccountForm";
import {
  ArrowLeft,
  CreditCard,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  Building2,
  ToggleLeft,
  Settings,
  Landmark,
  Plus,
  Copy,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/utils";
import { toast } from "react-hot-toast";

export const PaymentDetails = () => {
  const { paymentDetailsId, paymentTypeId } = useParams();
  const navigate = useNavigate();
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountInfo | null>(
    null
  );

  const { data: response, isLoading } = useQuery<PaymentDetailResponse>({
    queryKey: ["paymentDetail", { paymentDetailsId, paymentTypeId }],
    queryFn: () =>
      paymentTypeId
        ? getPaymentDetailInfoByTypeId(Number(paymentTypeId))
        : getPaymentDetailInfo(Number(paymentDetailsId)),
    enabled: !!paymentDetailsId || !!paymentTypeId,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!response) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Payment Detail Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The payment detail you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { paymentMethod, accountInfo } = response;
  const { PaymentType } = paymentMethod;

  const isActive = paymentMethod.isActive || PaymentType.status === "active";

  const handleAccountAction = (account?: AccountInfo) => {
    setSelectedAccount(account || null);
    setIsAccountFormOpen(true);
  };

  console.log({ paymentMethod, PaymentType });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">
              {PaymentType.name} Payment Details
            </h1>
            <p className="text-sm text-gray-600">
              Method: {PaymentType.PaymentMethod.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? (
              <CheckCircle2 className="w-4 h-4 mr-1" />
            ) : (
              <XCircle className="w-4 h-4 mr-1" />
            )}
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Payment Method Info Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <img
              src={PaymentType.image}
              alt={PaymentType.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{PaymentType.name}</h2>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    PaymentType.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {PaymentType.status}
                </span>
              </div>
              <p className="text-gray-600 mt-1">
                Method: {PaymentType.PaymentMethod.name}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Created: {formatDate(PaymentType.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    User ID: {PaymentType.userId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Number(paymentMethod?.maxLimit) > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Max Limit</p>
                <p className="text-xl font-semibold text-gray-900">
                  {Number(paymentMethod.maxLimit).toLocaleString()} BDT
                </p>
              </div>
            </div>
          </div>
        )}

        {Number(paymentMethod.currentUsage) > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Current Usage
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  {Number(paymentMethod.currentUsage).toLocaleString()} BDT
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Landmark className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Accounts
              </p>
              <p className="text-xl font-semibold text-gray-900">
                {accountInfo.filter((acc) => acc.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Linked Accounts</h2>
          <button
            onClick={() => handleAccountAction()}
            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Account
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {accountInfo.map((account) => (
            <div
              key={account.id}
              className="p-6 hover:bg-gray-50/50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {PaymentType.PaymentMethod.name === "MOBILE_BANKING"
                          ? "Mobile Number"
                          : "Bank Account"}
                      </p>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          account.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {account.status}
                      </span>
                    </div>

                    {/* Bank Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Account Number */}
                      <div className="group">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                          Account Number
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-gray-700">
                            {account.accountNumber}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                account.accountNumber
                              );
                              toast.success("Account number copied!");
                            }}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                            title="Copy account number"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Routing Number */}
                      {account.routingNumber && (
                        <div className="group">
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Routing Number
                          </label>
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-gray-700">
                              {account.routingNumber}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  account.routingNumber
                                );
                                toast.success("Routing number copied!");
                              }}
                              className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                              title="Copy routing number"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Branch Name */}
                      {account.branchName && (
                        <div className="group">
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Branch Name
                          </label>
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-gray-700">
                              {account.branchName}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  account.branchName
                                );
                                toast.success("Branch name copied!");
                              }}
                              className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                              title="Copy branch name"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Bank Name */}
                      {PaymentType.name && (
                        <div className="group">
                          <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Bank Name
                          </label>
                          <div className="flex items-center gap-2">
                            <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-gray-700">
                              {PaymentType.name}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(account.bankName);
                                toast.success("Bank name copied!");
                              }}
                              className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                              title="Copy bank name"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Usage Information */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Max Limit:</span>
                        <span className="font-medium text-gray-900">
                          {Number(account.maxLimit).toLocaleString()} BDT
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Used:</span>
                        <span className="font-medium text-gray-900">
                          {Number(account.currentUsage).toLocaleString()} BDT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAccountAction(account)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                  title="Configure account"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Form Modal */}
      <Modal
        isOpen={isAccountFormOpen}
        onClose={() => {
          setIsAccountFormOpen(false);
          setSelectedAccount(null);
        }}
        title={selectedAccount ? "Edit Account" : "Add New Account"}
        size="md"
      >
        <AccountForm
          paymentDetailId={Number(paymentDetailsId)}
          paymentTypeId={Number(paymentTypeId)}
          paymentMethod={PaymentType.PaymentMethod.name}
          initialData={selectedAccount}
          onSuccess={() => {
            setIsAccountFormOpen(false);
            setSelectedAccount(null);
          }}
        />
      </Modal>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <ToggleLeft className="w-4 h-4 mr-2" />
            Toggle Status
          </button>
          <button
            onClick={() => handleAccountAction()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Account
          </button>
        </div>
      </div>
    </div>
  );
};
