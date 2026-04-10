import React, { useEffect, useRef } from "react";
import { Animated, type ViewStyle } from "react-native";
import { colors } from "@/lib/theme";

export interface SkeletonProps {
  style?: ViewStyle;
  circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ style, circle = false }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.stone[200],
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
