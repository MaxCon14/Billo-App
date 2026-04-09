import React, { useEffect, useRef } from "react";
import { Pressable, Animated, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<ViewProps, "children"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const TRACK_WIDTH = 52;
const TRACK_PADDING = 2;
const THUMB_SIZE = 24;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  ...props
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
      className={cn(
        "justify-center rounded-full",
        checked
          ? "bg-primary-600 dark:bg-primary-500"
          : "bg-surface-300 dark:bg-dark-surface",
        disabled && "opacity-50",
        className
      )}
      style={{ width: TRACK_WIDTH, height: THUMB_SIZE + TRACK_PADDING * 2, padding: TRACK_PADDING }}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      {...props}
    >
      <Animated.View
        className="bg-white rounded-full shadow-sm"
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          transform: [{ translateX }],
        }}
      />
    </Pressable>
  );
};

Switch.displayName = "Switch";

export { Switch };
