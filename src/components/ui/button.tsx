import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
  children: ReactNode;
};

export function Button({ className, asChild, variant = "primary", size = "md", ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "secondary" && "border border-border bg-background text-foreground hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "gold" && "bg-highlight text-highlight-foreground hover:bg-highlight/90",
        size === "sm" && "h-9 rounded-md px-3 text-sm",
        size === "md" && "h-11 rounded-md px-5 text-sm",
        size === "lg" && "h-13 rounded-md px-6 text-base",
        size === "icon" && "size-10 rounded-md",
        className,
      )}
      {...props}
    />
  );
}