import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CreditCardIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    { name: "Payment Methods", icon: CreditCardIcon, path: "/payment-methods" },
    { name: "Payment Types", icon: CreditCardIcon, path: "/payment-types" },
    { name: "Mobile Banking", icon: CogIcon, path: "/mobile-banking" },
    { name: "Transactions", icon: ChartBarIcon, path: "/transactions" },
    { name: "User Management", icon: UserGroupIcon, path: "/users" },
    { name: "Notifications", icon: BellIcon, path: "/notifications" },
  ];

  return (
    <div
      className={`flex flex-col h-full ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className={`font-bold ${collapsed ? "text-center" : "text-xl"}`}>
          {collapsed ? "PAG" : "Payment Agent"}
        </h1>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary-600 ${
              location.pathname === item.path
                ? "bg-primary-50 text-primary-600"
                : ""
            }`}
          >
            <item.icon className="w-6 h-6" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:block absolute bottom-4 left-4 p-2 rounded-full hover:bg-gray-100"
      >
        {collapsed ? (
          <ChevronRightIcon className="w-5 h-5" />
        ) : (
          <ChevronLeftIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
