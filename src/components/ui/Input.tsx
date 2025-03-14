import { forwardRef } from "react";
import { cn } from "../../utils/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="mt-1">
          <input
            ref={ref}
            className={cn(
              "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400",
              "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              error ? "border-red-300" : "border-gray-300",
              className
            )}
            {...props}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
