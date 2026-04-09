import React, { useEffect, useRef } from "react";
import { Animated, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends ViewProps {
  className?: string;
  circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  circle = false,
  style,
  ...props
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={cn(
        "bg-surface-200 dark:bg-dark-surface",
        circle ? "rounded-full" : "rounded-xl",
        className
      )}
      style={[{ opacity }, style]}
      {...props}
    />
  );
};

Skeleton.displayName = "Skeleton";

export { Skeleton };
