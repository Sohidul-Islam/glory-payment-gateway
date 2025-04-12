import { Button, Dialog, Input, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { UpdateTransactionStatusData } from "../network/services";
import { XMarkIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { uploadFile } from "../utils/utils";
import { useAuth } from "../hooks/useAuth";

interface TransactionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: ExtendedTransaction | null;
  onStatusUpdate: (
    transactionId: number,
    data: UpdateTransactionStatusData
  ) => void;
  isUpdating: boolean;
}

export interface ExtendedTransaction {
  id: number;
  userId: number;
  requestedBy: number;
  paymentMethodId: number;
  paymentTypeId: number;
  paymentDetailId: number;
  paymentAccountId: number;
  transactionId: string;
  givenTransactionId: string;
  attachment: string | null;
  paymentSource: string;
  paymentSourceId: string;
  type: string;
  amount: string;
  commission: string;
  agentCommission: string;
  settledCommission: string | null;
  status: string;
  withdrawDescription: string | null;
  withdrawAccountNumber: string | null;
  remarks: string | null;
  approvedBy: number | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  PaymentMethod: {
    id: number;
    name: string;
    image: string;
  };
  PaymentType: {
    id: number;
    name: string;
    image: string;
  };
  PaymentDetail: {
    id: number;
    value: string;
    description: string;
    charge: string;
  };
  PaymentAccount: {
    id: number;
    accountNumber: string;
    accountName: string;
    branchName: string;
    routingNumber: string;
  };
  User: {
    id: number;
    fullName: string;
    email: string;
    image: string | null;
    phoneNumber: string;
    location: string;
    businessName: string | null;
    businessType: string | null;
    accountStatus: string;
    accountType: string;
    isVerified: boolean;
    verificationToken: string | null;
    agentId: string;
    reference: string | null;
    resetTokenExpiry: string | null;
    resetToken: string | null;
    commission: string;
    commissionType: string;
    agentCommission: string;
    agentCommissionType: string;
    isLoggedIn: boolean;
    createdAt: string;
    updatedAt: string;
  };
  requester: {
    id: number;
    fullName: string;
    email: string;
    image: string | null;
    phoneNumber: string;
    location: string;
    businessName: string | null;
    businessType: string | null;
    accountStatus: string;
    accountType: string;
    isVerified: boolean;
    verificationToken: string | null;
    agentId: string;
    reference: string | null;
    resetTokenExpiry: string | null;
    resetToken: string | null;
    commission: string;
    commissionType: string;
    agentCommission: string;
    agentCommissionType: string;
    isLoggedIn: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export default function TransactionPreviewModal({
  isOpen,
  onClose,
  transaction,
  onStatusUpdate,
  isUpdating,
}: TransactionPreviewModalProps) {
  const [remarks, setRemarks] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [settledCommission, setSettledCommission] = useState<string | null>(
    null
  );

  const [transactionId, setTransactionId] = useState("");

  const { user } = useAuth();

  if (!transaction) return null;

  const handleStatusUpdate = async (
    status: "PENDING" | "APPROVED" | "REJECTED" | "SETTLED"
  ) => {
    // let attachmentBase64: string | undefined;

    // if (attachment) {
    //   const reader = new FileReader();
    //   attachmentBase64 = await new Promise((resolve) => {
    //     reader.onloadend = () => {
    //       const base64String = reader.result as string;
    //       resolve(base64String.split(",")[1]); // Remove the data URL prefix
    //     };
    //     reader.readAsDataURL(attachment);
    //   });
    // }

    const url = attachment ? await uploadFile(attachment) : undefined;

    onStatusUpdate(transaction.id, {
      status,
      remarks: remarks.trim() || undefined,
      transactionId: transactionId.trim() || undefined,
      attachment: url,
      settledCommission: Number(settledCommission) || undefined,
    });
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      const url = URL.createObjectURL(file);
      setAttachmentUrl(url);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isWithdrawal = transaction.type.toLowerCase() === "withdraw";
  const isUser = user?.id === transaction.userId;
  const canModify = isUser && transaction.status === "PENDING";

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-2 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-xl sm:text-2xl font-semibold leading-6 text-gray-900 mb-4 sm:mb-6"
                    >
                      Transaction Details
                    </Dialog.Title>

                    <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-8">
                      {/* Transaction Overview */}
                      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                          <div className="space-y-1 sm:space-y-2">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">
                              Transaction ID
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 break-all">
                              {transaction.transactionId}
                            </p>
                          </div>
                          {isWithdrawal && (
                            <div className="space-y-1 sm:space-y-2">
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Given Transaction ID
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 break-all">
                                {transaction.givenTransactionId}
                              </p>
                            </div>
                          )}
                          <div className="space-y-1 sm:space-y-2">
                            <p className="text-xs sm:text-sm font-medium text-gray-500">
                              Status
                            </p>
                            <span
                              className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${getStatusColor(
                                transaction.status
                              )}`}
                            >
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          Payment Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Payment Method
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <img
                                  src={transaction.PaymentMethod?.image}
                                  alt={transaction.PaymentMethod?.name}
                                  className="h-5 w-5 sm:h-6 sm:w-6"
                                />
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                  {transaction.PaymentMethod?.name}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Payment Type
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <img
                                  src={transaction.PaymentType?.image}
                                  alt={transaction.PaymentType?.name}
                                  className="h-5 w-5 sm:h-6 sm:w-6"
                                />
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                  {transaction.PaymentType?.name}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Amount
                              </p>
                              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                ৳{transaction.amount}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Charge
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                ৳{transaction.PaymentDetail?.charge}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Withdrawal Information */}
                      {isWithdrawal && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                            Withdrawal Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-3 sm:space-y-4">
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">
                                  Account Number
                                </p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900 break-all">
                                  {transaction.withdrawAccountNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">
                                  Description
                                </p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                  {transaction.withdrawDescription}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* User Information */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          User Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Full Name
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.User?.fullName}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Email
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 break-all">
                                {transaction.User?.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Phone
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.User?.phoneNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Location
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.User?.location}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Business Name
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.User?.businessName || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Business Type
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.User?.businessType || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Account Type
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">
                                {transaction.User?.accountType}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Agent ID
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.User?.agentId}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Requester Information */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          Requester Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Full Name
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.requester?.fullName}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Email
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 break-all">
                                {transaction.requester?.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Phone
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.requester?.phoneNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Location
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.requester?.location}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Business Name
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.requester?.businessName || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Business Type
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.requester?.businessType || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Account Type
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">
                                {transaction.requester?.accountType}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Agent ID
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.requester?.agentId}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Commission Information */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                          Commission Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Admin Commission
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.commission}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Agent Commission
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.agentCommission}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500">
                                Settled Admin Commission
                              </p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {transaction.settledCommission || 0}
                              </p>
                            </div>

                            {Number(transaction?.commission) > 0 &&
                              transaction.status !== "SETTLED" && (
                                <Input
                                  type="number"
                                  className="w-full rounded-lg p-2 border !border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                  value={settledCommission || ""}
                                  disabled={!isUser}
                                  onChange={(e) =>
                                    setSettledCommission(e.target.value)
                                  }
                                />
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Attachment */}
                      {canModify && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                            Attachment
                          </h4>
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                <PaperClipIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                                <span className="text-xs sm:text-sm font-medium text-gray-700">
                                  {attachment ? attachment.name : "Choose file"}
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={handleAttachmentChange}
                                  accept="image/*,.pdf"
                                />
                              </label>
                            </div>
                            {(attachmentUrl || transaction.attachment) && (
                              <div className="mt-4">
                                <img
                                  src={
                                    attachmentUrl ||
                                    transaction.attachment ||
                                    ""
                                  }
                                  alt="Transaction attachment"
                                  className="max-w-full h-auto rounded-lg shadow-sm"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Remarks */}
                      {canModify && !transaction.givenTransactionId && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                            Transaction ID
                          </h4>
                          <Input
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            placeholder="Enter Transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                          />
                        </div>
                      )}

                      {canModify && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                            Remarks
                          </h4>
                          <textarea
                            rows={3}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            placeholder="Add remarks (optional)"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      {canModify && (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="button"
                            className="w-full sm:flex-1 inline-flex justify-center rounded-md bg-green-600 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
                            onClick={() => handleStatusUpdate("APPROVED")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Approving..." : "Approve"}
                          </button>
                          <button
                            type="button"
                            className="w-full sm:flex-1 inline-flex justify-center rounded-md bg-red-600 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
                            onClick={() => handleStatusUpdate("REJECTED")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      )}

                      {Number(settledCommission) > 0 &&
                        canModify &&
                        transaction.status !== "SETTLED" && (
                          <div className="flex justify-end rounded-xl border border-gray-200 p-4 sm:p-6">
                            <Button
                              onClick={() => handleStatusUpdate("SETTLED")}
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Settingtle..." : "Settle"}
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
