import React from "react";
import { View, Text, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "flex-row items-center rounded-full px-3 py-1",
  {
    variants: {
      variant: {
        default:
          "bg-primary-100 dark:bg-primary-900/30",
        secondary:
          "bg-surface-200 dark:bg-dark-surface",
        destructive:
          "bg-red-100 dark:bg-red-900/30",
        outline:
          "border border-surface-300 dark:border-dark-border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const badgeTextVariants = cva("text-xs font-semibold", {
  variants: {
    variant: {
      default: "text-primary-800 dark:text-primary-300",
      secondary: "text-surface-700 dark:text-dark-textSecondary",
      destructive: "text-red-800 dark:text-red-300",
      outline: "text-surface-700 dark:text-dark-textSecondary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends ViewProps,
    VariantProps<typeof badgeVariants> {
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

const Badge = React.forwardRef<React.ElementRef<typeof View>, BadgeProps>(
  ({ className, textClassName, variant, children, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={cn(badgeTextVariants({ variant }), textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, badgeTextVariants };
