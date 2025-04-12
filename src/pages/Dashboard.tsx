import { Card } from "../components/ui/Card";
import { AgentLinkCard } from "../components/dashboard/AgentLinkCard";
import { useAuth } from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "../network/services";
import { useState } from "react";
import { format, subDays } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("7"); // Default to 7 days

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, parseInt(dateRange));
    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    };
  };

  const { startDate, endDate } = getDateRange();

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ["dashboard-overview", startDate, endDate],
    queryFn: () => getDashboardOverview(startDate, endDate),
  });

  console.log({ overviewData });

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
      title: "Total Commission",
      value: `$${
        overviewData?.transactions?.totalCommission.toFixed(2) || "0.00"
      }`,
      // change: "N/A",
    },
    {
      title: "Agent Commission",
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

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <div className="flex gap-4">
          <select
            className="input-field max-w-xs"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
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
