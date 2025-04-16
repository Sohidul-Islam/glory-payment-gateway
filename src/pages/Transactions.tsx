import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  updateTransactionStatus,
  UpdateTransactionStatusData,
} from "../network/services";
import TransactionPreviewModal, {
  ExtendedTransaction,
} from "../components/TransactionPreviewModal";
import { format } from "date-fns";
import {
  CalendarIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAlert } from "../contexts/AlertContext";

interface TransactionsResponse {
  transactions: ExtendedTransaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    limit: number;
    total: number;
  };
}

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(
    null
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { showAlert } = useAlert();

  const { data, isLoading } = useQuery<TransactionsResponse>({
    queryKey: ["transactions", startDate, endDate, status, currentPage],
    queryFn: () =>
      getTransactions({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: status || undefined,
        page: currentPage,
      }),
  });

  const statusUpdateMutation = useMutation({
    mutationFn: ({
      transactionId,
      data,
    }: {
      transactionId: number;
      data: UpdateTransactionStatusData;
    }) => updateTransactionStatus(transactionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      showAlert("Transaction status updated successfully", "success");
      setSelectedTransaction(null);
    },
  });

  const handleStatusUpdate = (
    transactionId: number,
    data: UpdateTransactionStatusData
  ) => {
    statusUpdateMutation.mutate({ transactionId, data });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "SETTLED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFilterReset = () => {
    setStartDate("");
    setEndDate("");
    setStatus("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transactions in your account including their status
            and details.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </button>
        </div>
        {showFilters && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="SETTLED">Settled</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleFilterReset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Payment Method
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Payment Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Payment Details
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
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {transaction.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                        {transaction.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {transaction.PaymentMethod ? (
                          <div className="flex items-center">
                            <img
                              src={transaction.PaymentMethod.image}
                              alt={transaction.PaymentMethod.name}
                              className="h-5 w-5 mr-2"
                            />
                            <span>{transaction.PaymentMethod.name}</span>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {transaction.PaymentType ? (
                          <div className="flex items-center">
                            <img
                              src={transaction.PaymentType.image}
                              alt={transaction.PaymentType.name}
                              className="h-5 w-5 mr-2"
                            />
                            <span>{transaction.PaymentType.name}</span>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {transaction.PaymentDetail ? (
                          <div>
                            <div>{transaction.PaymentDetail.value}</div>
                            {transaction.PaymentDetail.charge && (
                              <div className="text-xs text-gray-400">
                                Charge: {transaction.PaymentDetail.charge}%
                              </div>
                            )}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ৳{transaction.amount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => setSelectedTransaction(transaction.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {data?.pagination && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!data.pagination.hasPrevPage}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  !data.pagination.hasPrevPage
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!data.pagination.hasNextPage}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  !data.pagination.hasNextPage
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * data.pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * data.pagination.limit,
                      data.pagination.total
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{data.pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!data.pagination.hasPrevPage}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      !data.pagination.hasPrevPage
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {Array.from(
                    { length: data.pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === currentPage
                          ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!data.pagination.hasNextPage}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      !data.pagination.hasNextPage
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <TransactionPreviewModal
        isOpen={selectedTransaction !== null}
        onClose={() => setSelectedTransaction(null)}
        transaction={
          data?.transactions.find((t) => t.id === selectedTransaction) || null
        }
        onStatusUpdate={handleStatusUpdate}
        isUpdating={statusUpdateMutation.isPending}
      />
    </div>
  );
};

export default Transactions;
