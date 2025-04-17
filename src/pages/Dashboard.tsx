import { Card } from "../components/ui/Card";
import { AgentLinkCard } from "../components/dashboard/AgentLinkCard";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "../network/services";
import { useState } from "react";
// import { format, subDays } from "date-fns";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  BanknotesIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { user } = useAuth();
  // const [dateRange, setDateRange] = useState("7"); // Default to 7 days
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // const { startDate, endDate } = getDateRange();

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ["dashboard-overview", startDate, endDate],
    queryFn: () => getDashboardOverview(startDate, endDate),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Transactions",
      value: overviewData?.transactions.count || 0,
      icon: CurrencyDollarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Amount",
      value: `৳${
        overviewData?.transactions?.totalAmount.toLocaleString() || "0"
      }`,
      icon: BanknotesIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Commission",
      value: `৳${
        overviewData?.transactions?.totalCommission.toLocaleString() || "0"
      }`,
      icon: ArrowTrendingUpIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Agent Commission",
      value: `৳${
        overviewData?.transactions?.agentCommission.toLocaleString() || "0"
      }`,
      icon: CurrencyDollarIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Settled Amount",
      value: `৳${
        overviewData?.transactions?.settledAmount.toLocaleString() || "0"
      }`,
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Deposit",
      value: `৳${
        overviewData?.transactions?.totalDeposit.toLocaleString() || "0"
      }`,
      icon: BanknotesIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Withdraw",
      value: `৳${
        overviewData?.transactions?.totalWithdraw.toLocaleString() || "0"
      }`,
      icon: BanknotesIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Approved",
      value: `৳${
        overviewData?.transactions?.totalApproved.toLocaleString() || "0"
      }`,
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Rejected",
      value: `৳${
        overviewData?.transactions?.totalRejected.toLocaleString() || "0"
      }`,
      icon: XCircleIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Settled",
      value: `৳${
        overviewData?.transactions?.totalSettled.toLocaleString() || "0"
      }`,
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Approved Count",
      value: overviewData?.transactions?.approvedCount || 0,
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Settled Count",
      value: overviewData?.transactions?.settledCount || 0,
      icon: CheckCircleIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Rejected Count",
      value: overviewData?.transactions?.rejectedCount || 0,
      icon: XCircleIcon,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Pending Count",
      value: overviewData?.transactions?.pendingCount || 0,
      icon: ClockIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Agent Link Section */}
      {user?.accountType !== "default" && (
        <>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div>
            <AgentLinkCard />
          </div>
        </>
      )}

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
              className="focus:ring-indigo-500 p-2 border focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
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
              className="focus:ring-indigo-500 p-2 border focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Transaction Statistics */}
      {overviewData?.transactions && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Transactions
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {overviewData.transactions.count}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      ৳{overviewData.transactions.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-xs text-gray-500">Total Charges</p>
                    <p className="text-sm font-medium text-indigo-600">
                      ৳
                      {overviewData.transactions.totalCommission.toLocaleString()}
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Deposits & Withdrawals
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ৳
                        {(
                          overviewData.transactions.totalDeposit +
                          overviewData.transactions.totalWithdraw
                        ).toLocaleString()}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Deposits</p>
                    <p className="text-sm font-medium text-green-600">
                      ৳{overviewData.transactions.totalDeposit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Withdrawals</p>
                    <p className="text-sm font-medium text-red-600">
                      ৳
                      {overviewData.transactions.totalWithdraw.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Transaction Status
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {overviewData.transactions.count}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Approved</p>
                    <p className="text-sm font-medium text-green-600">
                      {overviewData.transactions.approvedCount} (৳
                      {overviewData.transactions.totalApproved.toLocaleString()}
                      )
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rejected</p>
                    <p className="text-sm font-medium text-red-600">
                      {overviewData.transactions.rejectedCount} (৳
                      {overviewData.transactions.totalRejected.toLocaleString()}
                      )
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BanknotesIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Settled Transactions
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {overviewData.transactions.settledCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Settled Amount</p>
                    <p className="text-sm font-medium text-blue-600">
                      ৳{overviewData.transactions.totalSettled.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-sm font-medium text-yellow-600">
                      {overviewData.transactions.pendingCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className={`inline-flex p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <h3 className="text-gray-500 text-sm mt-4">{stat.title}</h3>
            <div className="flex items-baseline mt-2">
              <p className={`text-2xl font-semibold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
