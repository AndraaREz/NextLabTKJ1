"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary:
        "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
      danger:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      ghost:
        "hover:bg-accent hover:text-accent-foreground",
    };

    const sizes = {
      sm: "min-h-9 px-3 text-sm",
      md: "min-h-11 px-4 text-sm",
      lg: "min-h-12 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl",
          "font-medium",
          "transition-all duration-200 ease-out",
          "active:scale-[0.98]",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
