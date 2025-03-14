import { forwardRef, useState } from "react";
import { cn } from "../../utils/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    const inputType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

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
        <div className="relative mt-1">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400",
              "focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              isPasswordType && "pr-10",
              error ? "border-red-300" : "border-gray-300",
              className
            )}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeOff
                  className="h-4 w-4 text-gray-400 hover:text-gray-500"
                  aria-hidden="true"
                />
              ) : (
                <Eye
                  className="h-4 w-4 text-gray-400 hover:text-gray-500"
                  aria-hidden="true"
                />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          )}

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
