import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors, radius } from "@/lib/theme";

interface ProgressProps {
  value: number;
  color?: string;
}

export function Progress({ value, color }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: clampedValue,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [clampedValue]);

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color || colors.primary[500],
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    width: "100%",
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: colors.stone[100],
  },
  fill: {
    height: "100%",
    borderRadius: radius.full,
  },
});
