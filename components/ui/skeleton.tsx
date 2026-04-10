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
      style={[
        {
          backgroundColor: "#E7E5E4",
          borderRadius: circle ? 9999 : 12,
          opacity,
        },
        style,
      ]}
    />
  );
};

Skeleton.displayName = "Skeleton";

export { Skeleton };
