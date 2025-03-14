import { cn } from "../../utils/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Loader = ({ size = "md", className }: LoaderProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-primary-600",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};
