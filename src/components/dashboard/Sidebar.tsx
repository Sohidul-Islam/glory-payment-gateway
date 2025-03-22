import { Link, useLocation } from "react-router-dom";
import { Home, CreditCard, Bell, Settings, LogOut } from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 flex flex-col pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-4">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Glory Payment Gateway"
              />
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-2">
              <Link
                to="/dashboard"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/dashboard")
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/payment-types"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/dashboard/payment-types")
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Payment Types
              </Link>
              <Link
                to="/dashboard/notifications"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/dashboard/notifications")
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Bell className="mr-3 h-5 w-5" />
                Notifications
              </Link>
              <Link
                to="/dashboard/settings"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive("/dashboard/settings")
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </nav>
          </div>

          {/* Agent Link Section */}
          {/* <div className="px-4 py-4 border-t border-gray-200">
            <AgentLink agentId={userId} />
          </div> */}

          {/* Logout Section */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 w-full">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
