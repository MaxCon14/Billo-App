import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  color?: string;
}

export function Progress({ value, className, color }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: clampedValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [clampedValue]);

  return (
    <View
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-surface-200 dark:bg-dark-border",
        className
      )}
    >
      <Animated.View
        className={cn("h-full rounded-full", color || "bg-primary-500")}
        style={{
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </View>
  );
}
