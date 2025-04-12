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
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<TransactionsResponse>({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Transactions</h1>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ৳{transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
