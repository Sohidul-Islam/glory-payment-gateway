import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CreditCardIcon,
  // CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";

import logo from "../../assets/logo.png";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    { name: "Payment Methods", icon: CreditCardIcon, path: "/payment-methods" },
    { name: "Payment Types", icon: CreditCardIcon, path: "/payment-types" },
    // {
    //   name: "Payment Notes",
    //   icon: ClipboardDocumentListIcon,
    //   path: "/payment-notes",
    // },
    // { name: "Mobile Banking", icon: CogIcon, path: "/mobile-banking" },
    { name: "Transactions", icon: ChartBarIcon, path: "/transactions" },
    { name: "Charges", icon: ChartBarIcon, path: "/charges" },
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
        <img src={logo} alt="logo" className="h-10" />
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
        {menuItems
          .filter((item) => {
            if (user?.accountType === "default") {
              return !["Payment Methods", "Payment Types"].includes(item.name);
            }
            return true;
          })
          .map((item) => (
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
              {!collapsed && (
                <span>
                  {item.name === "User Management"
                    ? user?.accountType === "super admin"
                      ? "User Management"
                      : "Profile"
                    : item.name}
                </span>
              )}
            </Link>
          ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary-600 w-full"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-6 h-6" />
          ) : (
            <ChevronLeftIcon className="w-6 h-6" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
