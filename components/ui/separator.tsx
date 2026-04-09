import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends ViewProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const Separator = React.forwardRef<React.ElementRef<typeof View>, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "bg-surface-200 dark:bg-dark-border",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export { Separator };
