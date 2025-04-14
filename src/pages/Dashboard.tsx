import { Card } from "../components/ui/Card";
import { AgentLinkCard } from "../components/dashboard/AgentLinkCard";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "../network/services";
import { useState } from "react";
// import { format, subDays } from "date-fns";
import { CalendarIcon } from "@heroicons/react/24/outline";

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
      // change: "N/A",
    },
    {
      title: "Active Payment Methods",
      value: overviewData?.paymentMethods || 0,
      // change: "N/A",
    },
    {
      title: "Payment Types",
      value: overviewData?.paymentTypes || 0,
      // change: "N/A",
    },
    {
      title: "Total Amount",
      value: `$${overviewData?.transactions?.totalAmount.toFixed(2) || "0.00"}`,
      // change: "N/A",
    },
    {
      title: "Total Charges",
      value: `$${
        overviewData?.transactions?.totalCommission.toFixed(2) || "0.00"
      }`,
      // change: "N/A",
    },
    {
      title: "Agent Charges",
      value: `$${
        overviewData?.transactions?.agentCommission.toFixed(2) || "0.00"
      }`,
      change: "N/A",
    },
    {
      title: "Settled Amount",
      value: `$${
        overviewData?.transactions?.settledAmount.toFixed(2) || "0.00"
      }`,
      // change: "N/A",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Agent Link Section */}
      {user?.accountType !== "default" && (
        <>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="max-w-3xl">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <div className="flex items-baseline mt-4">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <span className="ml-2 text-sm text-gray-500">{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
