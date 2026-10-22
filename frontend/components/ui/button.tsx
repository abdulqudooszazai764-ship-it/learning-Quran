import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium " +
    "transition-[transform,box-shadow,background-color,opacity] duration-150 ease-out " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-b from-primary to-primary/90 text-primary-foreground shadow-elevation-md hover:shadow-elevation-lg hover:brightness-[1.04] active:brightness-[0.98]",
        outline:
          "border border-border bg-card/60 shadow-elevation-sm hover:border-primary/40 hover:bg-muted",
        ghost: "hover:bg-muted",
        destructive:
          "bg-linear-to-b from-destructive to-destructive/90 text-destructive-foreground shadow-elevation-md hover:shadow-elevation-lg hover:brightness-[1.04]",
        soft: "bg-primary/10 text-primary hover:bg-primary/15",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
