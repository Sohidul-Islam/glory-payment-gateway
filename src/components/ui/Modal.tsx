import { ReactNode } from "react";
import { cn } from "../../utils/utils";
import { X } from "lucide-react"; // Using lucide-react for icons

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  position?: "center" | "top";
  closeOnOutsideClick?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const positionClasses = {
  center: "items-center",
  top: "items-start pt-20",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  size = "md",
  position = "center",
  closeOnOutsideClick = true,
}: ModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50",
        positionClasses[position]
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "bg-white rounded-lg shadow-xl w-full mx-4",
          "transform transition-all",
          sizeClasses[size],
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center p-4 border-b">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
