import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, type ViewStyle } from "react-native";
import { colors, radius } from "@/lib/theme";

export interface SkeletonProps {
  style?: ViewStyle;
  circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ style, circle = false }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 900,
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
        styles.base,
        { borderRadius: circle ? radius.full : radius.md, opacity },
        style,
      ]}
    />
  );
};

Skeleton.displayName = "Skeleton";

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
  },
});

export { Skeleton };
