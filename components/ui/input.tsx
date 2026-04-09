import React from "react";
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
} from "react-native";
import { cn } from "@/lib/utils";

export interface InputProps extends TextInputProps {
  className?: string;
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, label, error, containerClassName, ...props }, ref) => {
    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="text-sm font-medium text-surface-700 dark:text-dark-textSecondary mb-1.5">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            "h-12 rounded-xl border border-surface-300 dark:border-dark-border bg-white dark:bg-dark-card px-4 text-base text-surface-900 dark:text-dark-text",
            error && "border-red-500 dark:border-red-500",
            props.editable === false && "opacity-50",
            className
          )}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {error && (
          <Text className="text-sm text-red-500 mt-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };
