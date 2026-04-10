import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "@/lib/theme";

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
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [clampedValue]);

  return (
    <View style={s.track}>
      <Animated.View
        style={{
          height: "100%",
          borderRadius: 9999,
          backgroundColor: color || colors.primary[500],
          width: width.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  track: {
    height: 8,
    width: "100%",
    overflow: "hidden",
    borderRadius: 9999,
    backgroundColor: colors.stone[200],
  },
});
