import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { ExtendedTransaction } from "./TransactionPreviewModal";
import { format } from "date-fns";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: ExtendedTransaction[];
  totalAmount: number;
  totalCommission: number;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  transactions,
  totalAmount,
  totalCommission,
}: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const formatCurrency = (amount: number | string) => {
    return `৳${Number(amount).toFixed(2)}`;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Admin Commission Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 20px;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              color: #111827;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .invoice-details-left, .invoice-details-right {
              flex: 1;
            }
            .invoice-details-right {
              text-align: right;
            }
            .invoice-summary {
              background-color: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            th {
              background-color: #f9fafb;
              font-weight: 600;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 600;
            }
            .status-settled {
              background-color: #d1fae5;
              color: #065f46;
            }
            .status-pending {
              background-color: #fef3c7;
              color: #92400e;
            }
            .status-rejected {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .total-row {
              font-weight: 600;
            }
            .commission-amount {
              color: #4f46e5;
            }
            .print-button {
              display: none;
            }
            @media print {
              .print-button {
                display: none;
              }
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="invoice-title">Admin charges Invoice</div>
            <div>
              <div>Date: ${formatDate(new Date().toISOString())}</div>
              <div>Invoice #: INV-${Math.floor(Math.random() * 1000000)}</div>
            </div>
          </div>
          
          <div class="invoice-summary">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <h3 style="margin-top: 0;">Invoice Details</h3>
                <p>Total Transactions: ${transactions.length}</p>
              </div>
              <div style="text-align: right;">
                <h3 style="margin-top: 0;">Summary</h3>
                <p>Total Amount: ${formatCurrency(totalAmount)}</p>
                <p style="color: #4f46e5; font-weight: 600;">Total Charges: ${formatCurrency(
                  totalCommission
                )}</p>
              </div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>User Name</th>
                <th>Agent ID</th>
                <th>Amount</th>
                <th>Charges</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${transactions
                .map(
                  (transaction) => `
                <tr>
                  <td>${transaction.id}</td>
                  <td>${formatDate(transaction.createdAt)}</td>
                  <td>${transaction.User?.fullName || "N/A"}</td>
                  <td>${transaction.User?.agentId || "N/A"}</td>
                  <td>${formatCurrency(transaction.amount)}</td>
                  <td class="commission-amount">${formatCurrency(
                    transaction.commission
                  )}</td>
                  <td>
                    <span class="status-badge ${
                      transaction.status === "SETTLED"
                        ? "status-settled"
                        : transaction.status === "PENDING"
                        ? "status-pending"
                        : "status-rejected"
                    }">
                      ${transaction.status}
                    </span>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="5" style="text-align: right;">Total</td>
                <td class="commission-amount">${formatCurrency(
                  totalCommission
                )}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          
          <div style="text-align: center; margin-top: 40px; font-size: 14px; color: #6b7280;">
            <p>Thank you for your business!</p>
          </div>
          
          <button class="print-button" onclick="window.print()">Print Invoice</button>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (optional)
      // printWindow.close();
    }, 500);
  };

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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
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
                      Charges Invoice
                    </Dialog.Title>

                    <div
                      className="mt-4 sm:mt-6 space-y-4 sm:space-y-8"
                      ref={invoiceRef}
                    >
                      {/* Invoice Header */}
                      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              Invoice Details
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              Date: {formatDate(new Date().toISOString())}
                            </p>
                            <p className="text-sm text-gray-500">
                              Invoice #: INV-
                              {Math.floor(Math.random() * 1000000)}
                            </p>
                          </div>
                          <div className="text-right">
                            <h4 className="text-lg font-medium text-gray-900">
                              Summary
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              Total Transactions: {transactions.length}
                            </p>
                            <p className="text-sm text-gray-500">
                              Total Amount: {formatCurrency(totalAmount)}
                            </p>
                            <p className="text-sm font-medium text-indigo-600">
                              Total Charges: {formatCurrency(totalCommission)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Transactions Table */}
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                ID
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                User Name
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Agent ID
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Amount
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Charges
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction) => (
                              <tr key={transaction.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  {transaction.id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {formatDate(transaction.createdAt)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {transaction.User?.fullName || "N/A"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {transaction.User?.agentId || "N/A"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {formatCurrency(transaction.amount)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600 font-medium">
                                  {formatCurrency(transaction.commission)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      transaction.status === "SETTLED"
                                        ? "bg-green-100 text-green-800"
                                        : transaction.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : transaction.status === "REJECTED"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {transaction.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <th
                                scope="row"
                                colSpan={5}
                                className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                Total
                              </th>
                              <td className="px-3 py-3.5 text-sm font-semibold text-indigo-600">
                                {formatCurrency(totalCommission)}
                              </td>
                              <td className="px-3 py-3.5"></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 flex justify-between">
                        <div className="text-sm text-gray-500">
                          Thank you for your business!
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handlePrint}
                          >
                            <PrinterIcon className="h-5 w-5 mr-2" />
                            Print Invoice
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onClose}
                          >
                            Close
                          </button>
                        </div>
                      </div>
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
