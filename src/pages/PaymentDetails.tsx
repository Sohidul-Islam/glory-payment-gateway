import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { PaymentDetailResponse, getPaymentDetailInfo, AccountInfo } from "../network/services";
import { Loader } from "../components/ui/Loader";
import { Modal } from "../components/ui/Modal";
import { AccountForm } from "../components/payment/AccountForm";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/utils";

export const PaymentDetails = () => {
  const { paymentDetailsId } = useParams();
  const navigate = useNavigate();
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountInfo | null>(null);

  const { data: response, isLoading } = useQuery<PaymentDetailResponse>({
    queryKey: ["paymentDetail", paymentDetailsId],
    queryFn: () => getPaymentDetailInfo(Number(paymentDetailsId)),
    enabled: !!paymentDetailsId,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!response) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Payment Detail Not Found</h2>
          <p className="mt-2 text-gray-600">The payment detail you're looking for doesn't exist.</p>
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

  const handleAccountAction = (account?: AccountInfo) => {
    setSelectedAccount(account || null);
    setIsAccountFormOpen(true);
  };

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
            <h1 className="text-2xl font-semibold">{PaymentType.name} Payment Details</h1>
            <p className="text-sm text-gray-600">{paymentMethod.value} - {paymentMethod.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              paymentMethod.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {paymentMethod.isActive ? (
              <CheckCircle2 className="w-4 h-4 mr-1" />
            ) : (
              <XCircle className="w-4 h-4 mr-1" />
            )}
            {paymentMethod.isActive ? "Active" : "Inactive"}
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Current Usage</p>
              <p className="text-xl font-semibold text-gray-900">
                {Number(paymentMethod.currentUsage).toLocaleString()} BDT
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Landmark className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Accounts</p>
              <p className="text-xl font-semibold text-gray-900">
                {accountInfo.filter(acc => acc.isActive).length}
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
            <div key={account.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gray-100">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        Account: {account.accountNumber}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          account.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {account.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                      <span>Max: {Number(account.maxLimit).toLocaleString()} BDT</span>
                      <span>Used: {Number(account.currentUsage).toLocaleString()} BDT</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAccountAction(account)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
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