import React, { useEffect } from "react";
import { IoCheckmarkCircle, IoWarning, IoCloseCircle } from "react-icons/io5";

type AlertType = "success" | "warn" | "error";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  type: AlertType;
  onClose: () => void;
  duration?: number;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-500",
          textColor: "text-green-800",
          icon: <IoCheckmarkCircle className="w-6 h-6 text-green-500" />,
        };
      case "warn":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-500",
          textColor: "text-yellow-800",
          icon: <IoWarning className="w-6 h-6 text-yellow-500" />,
        };
      case "error":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-500",
          textColor: "text-red-800",
          icon: <IoCloseCircle className="w-6 h-6 text-red-500" />,
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative transform overflow-hidden rounded-lg ${styles.bgColor} px-4 py-3 shadow-xl transition-all sm:w-full sm:max-w-sm`}
        role="alert"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">{styles.icon}</div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${styles.textColor}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={`inline-flex rounded-md ${styles.bgColor} p-1.5 ${styles.textColor} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${styles.bgColor} focus:ring-${styles.borderColor}`}
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <IoCloseCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
