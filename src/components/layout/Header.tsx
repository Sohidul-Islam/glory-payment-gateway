import { useState } from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationCount } from "../../network/services";
import { displayAccountType } from "../../utils/utils";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigator = useNavigate();

  const { user, logout } = useAuth();

  const { data: unreadCountData } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  console.log([unreadCountData]);

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          {children}
          {/* Search Bar - Hide on mobile */}
          {/* <div className="hidden md:block max-w-lg">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div> */}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={() => navigator("/notifications")}
          >
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
              {unreadCountData?.unreadCount}
            </span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2"
            >
              <UserCircleIcon className="w-8 h-8 text-gray-600" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  {displayAccountType(user?.accountType || "")}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <a
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
