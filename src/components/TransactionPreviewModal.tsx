import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  Transaction,
  TransactionStatus,
  UpdateTransactionStatusData,
} from "../network/services";
import { format } from "date-fns";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Copy, Upload } from "lucide-react";
import { X } from "lucide-react";
import { uploadFile } from "../utils/utils";

interface TransactionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onStatusUpdate: (
    transactionId: number,
    data: UpdateTransactionStatusData
  ) => void;
  isUpdating: boolean;
}

const TransactionPreviewModal = ({
  isOpen,
  onClose,
  transaction,
  onStatusUpdate,
  isUpdating,
}: TransactionPreviewModalProps) => {
  const [remarks, setRemarks] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<TransactionStatus | null>(null);

  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const handleStatusUpdate = (status: TransactionStatus) => {
    setSelectedStatus(status);
    setShowStatusDialog(true);
  };

  const handleConfirmStatusUpdate = () => {
    if (selectedStatus) {
      onStatusUpdate(transaction.id, {
        status: selectedStatus,
        remarks: remarks.trim() || undefined,
        attachment: attachmentUrl || undefined,
        transactionId: transactionNumber || undefined,
      });
      setShowStatusDialog(false);
      setSelectedStatus(null);
      setRemarks("");
    }
  };

  const handleTransactionNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionNumber(e.target.value);
  };

  const handleAttachmentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);

      const fileUrl = await uploadFile(file);

      // Create a URL for the file preview
      setAttachmentUrl(fileUrl);
    }
  };

  // Clean up the object URL when component unmounts or file changes

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

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Transaction Details
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-6">
                    {/* Transaction IDs */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Transaction ID
                        </p>
                        <p className="text-sm text-gray-900">
                          {transaction.transactionId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Given Transaction ID
                        </p>
                        <p className="text-sm text-gray-900">
                          {transaction.givenTransactionId}
                        </p>
                      </div>
                    </div>

                    {/* Transaction Number for Withdrawal */}
                    {transaction.type === "withdraw" && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Transaction Number
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={transactionNumber}
                            onChange={handleTransactionNumberChange}
                            placeholder="Enter transaction number"
                            className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-colors text-sm"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(transactionNumber);
                            }}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            title="Copy transaction number"
                          >
                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Status
                      </p>
                      <span
                        className={`${getStatusColor(
                          transaction.status
                        )} mt-2 p-1 rounded-md`}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    {/* Payment Method and Type */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Payment Method
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src={transaction.PaymentMethod.image}
                            alt={transaction.PaymentMethod.name}
                            className="h-6 w-6"
                          />
                          <p className="text-sm text-gray-900">
                            {transaction.PaymentMethod.name}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Payment Type
                        </p>
                        <div className="flex items-center gap-2">
                          <img
                            src={transaction.PaymentType.image}
                            alt={transaction.PaymentType.name}
                            className="h-6 w-6"
                          />
                          <p className="text-sm text-gray-900">
                            {transaction.PaymentType.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Amount and Type */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Amount
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          ৳{transaction.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Transaction Type
                        </p>
                        <p className="text-sm text-gray-900 capitalize">
                          {transaction.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Commission
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          ৳{transaction.commission}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Commission Type
                        </p>
                        <p className="text-sm text-gray-900 capitalize">
                          {transaction.commissionType}
                        </p>
                      </div>
                    </div>

                    {/* Payment Source */}
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Payment Source
                      </p>
                      <p className="text-sm text-gray-900 capitalize">
                        {transaction.paymentSource} (ID:{" "}
                        {transaction.paymentSourceId})
                      </p>
                    </div>

                    {/* Withdrawal Details */}
                    {transaction.type === "withdraw" && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Withdrawal Details
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-900">
                            Withdrawal Account:{" "}
                            {transaction.withdrawAccountNumber || "N/A"}
                          </p>
                          <p className="text-sm text-gray-900">
                            Description:{" "}
                            {transaction.withdrawDescription || "N/A"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Account Details */}
                    {transaction.type === "deposit" && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Account Details
                        </p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-900">
                            Account Number:{" "}
                            {transaction.PaymentAccount.accountNumber}
                          </p>
                          {transaction.PaymentAccount.accountName && (
                            <p className="text-sm text-gray-900">
                              Account Name:{" "}
                              {transaction.PaymentAccount.accountName}
                            </p>
                          )}
                          {transaction.PaymentAccount.branchName && (
                            <p className="text-sm text-gray-900">
                              Branch: {transaction.PaymentAccount.branchName}
                            </p>
                          )}
                          {transaction.PaymentAccount.routingNumber && (
                            <p className="text-sm text-gray-900">
                              Routing Number:{" "}
                              {transaction.PaymentAccount.routingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Payment Detail */}
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Payment Detail
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-900">
                          Value: {transaction?.PaymentDetail?.value}
                        </p>
                        <p className="text-sm text-gray-900">
                          Description: {transaction?.PaymentDetail?.description}
                        </p>
                        <p className="text-sm text-gray-900">
                          Charge: ৳{transaction?.PaymentDetail?.charge}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Remark
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-900">
                          {transaction?.remarks || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Attachment */}
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Attachment
                      </p>
                      {transaction.type === "withdraw" ? (
                        <div className="mt-2">
                          {attachmentUrl ? (
                            <div className="relative group">
                              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                                {attachment?.type.startsWith("image/") ? (
                                  <img
                                    src={attachmentUrl}
                                    alt="Receipt preview"
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center p-4">
                                      <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                      <p className="mt-2 text-sm font-medium text-gray-900">
                                        {attachment?.name}
                                      </p>
                                      <p className="mt-1 text-xs text-gray-500">
                                        PDF Document
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setAttachment(null);
                                  if (attachmentUrl) {
                                    URL.revokeObjectURL(attachmentUrl);
                                    setAttachmentUrl(null);
                                  }
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors hover:bg-gray-50">
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
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                  <Upload className="w-5 h-5 text-indigo-600" />
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
                      ) : transaction.attachment ? (
                        <div className="mt-2">
                          <a
                            href={transaction.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-900"
                          >
                            <span>View Attachment</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-gray-400">
                          No attachment available
                        </p>
                      )}
                    </div>

                    {/* Timestamps */}
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div>
                        <p>Created: {formatDate(transaction.createdAt)}</p>
                      </div>
                      <div>
                        <p>Updated: {formatDate(transaction.updatedAt)}</p>
                      </div>
                    </div>

                    {/* Status Update Section */}
                    {transaction.status === "PENDING" && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Update Transaction Status
                        </h4>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleStatusUpdate("APPROVED")}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            {transaction.type === "withdraw"
                              ? "Approve Withdrawal"
                              : "Approve Deposit"}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate("REJECTED")}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Status Update Confirmation Dialog */}
      <Transition appear show={showStatusDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowStatusDialog(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Status Update
                  </Dialog.Title>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to{" "}
                      <span className="font-medium text-gray-900">
                        {selectedStatus?.toLowerCase()}
                      </span>{" "}
                      this transaction?
                    </p>

                    <div className="mt-4">
                      <label
                        htmlFor="remarks"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Remarks (Optional)
                      </label>
                      <textarea
                        id="remarks"
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Add any remarks about this status update..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setShowStatusDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50"
                      onClick={handleConfirmStatusUpdate}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Confirm"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TransactionPreviewModal;
