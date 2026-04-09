import React from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-xl active:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-primary-600 dark:bg-primary-500",
        destructive: "bg-red-500 dark:bg-red-600",
        outline:
          "border border-surface-300 dark:border-dark-border bg-transparent",
        secondary: "bg-surface-200 dark:bg-dark-surface",
        ghost: "bg-transparent",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-9 px-4",
        lg: "h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("font-semibold text-base", {
  variants: {
    variant: {
      default: "text-white",
      destructive: "text-white",
      outline: "text-surface-900 dark:text-dark-text",
      secondary: "text-surface-900 dark:text-dark-text",
      ghost: "text-surface-900 dark:text-dark-text",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
      icon: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends Omit<PressableProps, "children">,
    VariantProps<typeof buttonVariants> {
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, textClassName, variant, size, children, disabled, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          disabled && "opacity-50",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {typeof children === "string" ? (
          <Text
            className={cn(
              buttonTextVariants({ variant, size }),
              textClassName
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants, buttonTextVariants };
