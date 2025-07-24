import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary font-semibold text-primary-foreground shadow hover:bg-primary/90 tracking-tight",
        destructive:
          "bg-destructive font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90 tracking-tight",
        outline:
          "border font-semibold border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground tracking-tight",
        secondary:
          "bg-secondary font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80 tracking-tight",
        ghost: "hover:bg-accent hover:text-accent-foreground font-semibold tracking-tight",
        link: "text-primary underline-offset-4 hover:underline font-semibold tracking-tight",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
