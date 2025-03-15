import { Card } from "../components/ui/Card";
import { LineChart, BarChart } from "../components/charts";
import { AgentLinkCard } from "../components/dashboard/AgentLinkCard";

const Dashboard = () => {
  const stats = [
    { title: "Total Transactions", value: "2,543", change: "+12.5%" },
    { title: "Active Payment Methods", value: "8", change: "+2" },
    { title: "Success Rate", value: "95.8%", change: "+0.8%" },
    { title: "Total Revenue", value: "$12,435", change: "+15.3%" },
  ];

  const transactionData = [
    { name: "Jan", value: 1200 },
    { name: "Feb", value: 1900 },
    { name: "Mar", value: 1500 },
    { name: "Apr", value: 2100 },
    { name: "May", value: 1800 },
    { name: "Jun", value: 2400 },
  ];

  const methodsData = [
    { name: "bKash", value: 450 },
    { name: "Nagad", value: 380 },
    { name: "Rocket", value: 220 },
    { name: "Cards", value: 310 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Agent Link Section */}
      <div className="max-w-3xl">
        <AgentLinkCard />
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-4">
          <select className="input-field max-w-xs">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <div className="flex items-baseline mt-4">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <span
                className={`ml-2 text-sm ${
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Transaction Overview</h3>
          <LineChart data={transactionData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Payment Methods Usage</h3>
          <BarChart data={methodsData} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
