import React, { createContext, useContext, useState, useCallback } from "react";
import AlertModal from "../components/AlertModal";

type AlertType = "success" | "warn" | "error";

interface AlertContextType {
  showAlert: (message: string, type: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AlertType>("success");

  const showAlert = useCallback((message: string, type: AlertType) => {
    setMessage(message);
    setType(type);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal
        isOpen={isOpen}
        message={message}
        type={type}
        onClose={handleClose}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
