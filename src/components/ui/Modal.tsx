import { ReactNode } from "react";
import { cn } from "../../utils/utils";
import { X } from "lucide-react"; // Using lucide-react for icons
import { Dialog } from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  position?: "center" | "top";
  closeOnOutsideClick?: boolean;
}

const positionClasses = {
  center: "items-center",
  top: "items-start pt-20",
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
}: ModalProps) => {
  const modalSize = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  }[size];

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30 z-40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <Dialog.Panel
          className={cn(
            "w-full bg-white rounded-xl shadow-xl transform transition-all",
            "flex flex-col",
            "max-h-[calc(100vh-2rem)]", // Account for padding
            modalSize
          )}
        >
          <div className="flex-none flex justify-between items-center px-4 sm:px-6 py-4 border-b">
            <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
