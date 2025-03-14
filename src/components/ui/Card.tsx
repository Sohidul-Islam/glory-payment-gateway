import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-white rounded-lg shadow-sm", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
