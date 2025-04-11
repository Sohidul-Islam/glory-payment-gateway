import { useState } from "react";
import { Card } from "../components/ui/Card";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotifications,
  Notification,
} from "../network/services";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    []
  );
  const limit = 10;

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getNotifications(page, limit),
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as read");
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark all notifications as read");
    },
  });

  const deleteNotificationsMutation = useMutation({
    mutationFn: deleteNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notifications deleted successfully");
      setSelectedNotifications([]);
    },
    onError: () => {
      toast.error("Failed to delete notifications");
    },
  });

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate([notificationId]);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) {
      toast.error("Please select notifications to delete");
      return;
    }
    deleteNotificationsMutation.mutate(selectedNotifications);
  };

  const toggleNotificationSelection = (notificationId: number) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.relatedEntityType === "Transaction") {
      navigate(`/transactions/${notification.relatedEntityId}`);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const unreadCount = notificationsData?.data?.unreadCount ?? 0;
  const notifications = notificationsData?.notifications ?? [];
  const pagination = notificationsData?.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread notifications
            </p>
          )}
        </div>
        <div className="flex gap-4">
          {selectedNotifications.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Delete Selected ({selectedNotifications.length})
            </button>
          )}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-sm text-primary-600 hover:bg-gray-50 rounded-lg"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification: Notification) => (
          <Card
            key={notification.id}
            className={`p-4 ${
              !notification.read ? "border-l-4 border-primary-500" : ""
            }`}
          >
            <div className="flex gap-4">
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => toggleNotificationSelection(notification.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div
                className="flex-1 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2"
                onClick={() => handleNotificationClick(notification)}
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
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          {notification.timestamp}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700"
                          >
                            Mark as read
                          </button>
                        )}
                        <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No notifications found
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
