import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Transaction } from "../network/services";
import { format } from "date-fns";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TransactionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onApprove: (transactionId: number) => void;
  isApproving: boolean;
}

const TransactionPreviewModal = ({
  isOpen,
  onClose,
  transaction,
  onApprove,
  isApproving,
}: TransactionPreviewModalProps) => {
  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  return (
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

                  {/* Status */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === "success"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
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

                  {/* Account Details */}
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
                          Account Name: {transaction.PaymentAccount.accountName}
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

                  {/* Payment Detail */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Payment Detail
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-900">
                        Value: {transaction.PaymentDetail.value}
                      </p>
                      <p className="text-sm text-gray-900">
                        Description: {transaction.PaymentDetail.description}
                      </p>
                      <p className="text-sm text-gray-900">
                        Charge: ৳{transaction.PaymentDetail.charge}
                      </p>
                    </div>
                  </div>

                  {/* Attachment */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Attachment
                    </p>
                    {transaction.attachment ? (
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
                  {transaction.status === "pending" && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50"
                      onClick={() => onApprove(transaction.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? "Approving..." : "Approve Transaction"}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransactionPreviewModal;
