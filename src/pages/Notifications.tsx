import { useState } from "react";
import { Card } from "../components/ui/Card";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface Notification {
  id: number;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Notifications = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: "success",
      title: "Payment Method Added",
      message: "New payment method 'bKash' has been successfully added.",
      timestamp: "2024-03-15 14:30",
      read: false,
    },
    {
      id: 2,
      type: "error",
      title: "Transaction Failed",
      message: "Transaction #TRX001 failed due to insufficient balance.",
      timestamp: "2024-03-15 13:45",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "System Update",
      message: "System maintenance scheduled for tonight at 2 AM.",
      timestamp: "2024-03-15 12:00",
      read: true,
    },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="w-6 h-6 text-green-500 shrink-0" />;
      case "error":
        return (
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500 shrink-0" />
        );
      case "warning":
        return (
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 shrink-0" />
        );
      case "info":
        return (
          <InformationCircleIcon className="w-6 h-6 text-blue-500 shrink-0" />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-sm text-primary-600 hover:bg-gray-50 rounded-lg">
            Mark all as read
          </button>
          <button className="px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg">
            Clear all
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 ${
              !notification.read ? "border-l-4 border-primary-500" : ""
            }`}
          >
            <div className="flex gap-4">
              {getIcon(notification.type)}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {notification.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
