import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary:
    "bg-journal-accent text-journal-bg font-medium hover:bg-journal-accent-light disabled:opacity-50",
  ghost:
    "text-journal-muted hover:text-journal-text hover:bg-journal-raised disabled:opacity-50",
  danger:
    "text-journal-danger hover:bg-journal-danger/10 disabled:opacity-50",
  outline:
    "border border-journal-border text-journal-text hover:bg-journal-raised disabled:opacity-50",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-2.5 text-base rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center gap-2 transition-colors cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
