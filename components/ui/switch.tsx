import React, { useEffect, useRef } from "react";
import { Pressable, Animated } from "react-native";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const TRACK_WIDTH = 52;
const TRACK_PADDING = 2;
const THUMB_SIZE = 24;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
}) => {
  const translateX = useRef(new Animated.Value(checked ? TRAVEL : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: checked ? TRAVEL : 0,
      useNativeDriver: true,
      bounciness: 2,
      speed: 20,
    }).start();
  }, [checked, translateX]);

  return (
    <Pressable
      onPress={() => !disabled && onCheckedChange(!checked)}
      style={{
        width: TRACK_WIDTH,
        height: THUMB_SIZE + TRACK_PADDING * 2,
        padding: TRACK_PADDING,
        justifyContent: "center",
        borderRadius: (THUMB_SIZE + TRACK_PADDING * 2) / 2,
        backgroundColor: checked ? "#0D9488" : "#D6D3D1",
        opacity: disabled ? 0.5 : 1,
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
    >
      <Animated.View
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2,
          backgroundColor: "#FFFFFF",
          transform: [{ translateX }],
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.5,
        }}
      />
    </Pressable>
  );
};

Switch.displayName = "Switch";

export { Switch };
