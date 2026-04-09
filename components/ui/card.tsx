import React from "react";
import { View, Text, type ViewProps, type TextProps } from "react-native";
import { cn } from "@/lib/utils";

// Card
export interface CardProps extends ViewProps {
  className?: string;
}

const Card = React.forwardRef<React.ElementRef<typeof View>, CardProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm border border-surface-200 dark:border-dark-border",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// CardHeader
export interface CardHeaderProps extends ViewProps {
  className?: string;
}

const CardHeader = React.forwardRef<React.ElementRef<typeof View>, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("pb-3", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// CardTitle
export interface CardTitleProps extends TextProps {
  className?: string;
}

const CardTitle = React.forwardRef<React.ElementRef<typeof Text>, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn(
        "text-lg font-bold text-surface-900 dark:text-dark-text",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

// CardDescription
export interface CardDescriptionProps extends TextProps {
  className?: string;
}

const CardDescription = React.forwardRef<React.ElementRef<typeof Text>, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn(
        "text-sm text-surface-500 dark:text-dark-textSecondary",
        className
      )}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

// CardContent
export interface CardContentProps extends ViewProps {
  className?: string;
}

const CardContent = React.forwardRef<React.ElementRef<typeof View>, CardContentProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("py-2", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

// CardFooter
export interface CardFooterProps extends ViewProps {
  className?: string;
}

const CardFooter = React.forwardRef<React.ElementRef<typeof View>, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("flex-row items-center pt-3", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
