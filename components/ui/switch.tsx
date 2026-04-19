import React, { useEffect, useRef } from "react";
import { Pressable, Animated, StyleSheet } from "react-native";
import { colors } from "@/lib/theme";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 30;
const TRACK_PADDING = 3;
const THUMB_SIZE = 24;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
}) => {
  const translateX = useRef(new Animated.Value(checked ? TRAVEL : 0)).current;
  const trackColor = useRef(
    new Animated.Value(checked ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: checked ? TRAVEL : 0,
        useNativeDriver: false,
        bounciness: 4,
        speed: 16,
      }),
      Animated.timing(trackColor, {
        toValue: checked ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [checked, translateX, trackColor]);

  const interpolatedBg = trackColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.accent.yellow],
  });

  return (
    <Pressable
      onPress={() => !disabled && onCheckedChange(!checked)}
      style={[
        styles.track,
        { opacity: disabled ? 0.4 : 1 },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
    >
      <Animated.View
        style={[
          styles.trackInner,
          { backgroundColor: interpolatedBg },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

Switch.displayName = "Switch";

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
  },
  trackInner: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: TRACK_PADDING,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.foreground,
  },
});

export { Switch };
