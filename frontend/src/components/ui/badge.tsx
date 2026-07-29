import * as React from "react";

type BadgeVariant = "default" | "secondary" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-primary text-primary-foreground",
    secondary:
      "bg-secondary text-secondary-foreground",
    outline:
      "border border-border bg-transparent",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
}