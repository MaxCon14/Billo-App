import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { colors, shadows, radius } from "@/lib/theme";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

function getVariantStyle(variant: ButtonVariant): ViewStyle {
  switch (variant) {
    case "destructive":
      return {
        backgroundColor: colors.red[500],
        ...shadows.sm,
      };
    case "outline":
      return {
        borderWidth: 1.5,
        borderColor: colors.stone[200],
        backgroundColor: colors.white,
      };
    case "secondary":
      return {
        backgroundColor: colors.stone[100],
      };
    case "ghost":
      return {
        backgroundColor: colors.transparent,
      };
    case "default":
    default:
      return {
        backgroundColor: colors.primary[600],
        ...shadows.sm,
      };
  }
}

function getTextVariantStyle(variant: ButtonVariant): TextStyle {
  switch (variant) {
    case "default":
      return { color: colors.white };
    case "destructive":
      return { color: colors.white };
    case "outline":
      return { color: colors.stone[800] };
    case "secondary":
      return { color: colors.stone[800] };
    case "ghost":
      return { color: colors.primary[600] };
    default:
      return { color: colors.white };
  }
}

function getSizeStyle(size: ButtonSize): ViewStyle {
  switch (size) {
    case "sm":
      return { height: 40, paddingHorizontal: 16 };
    case "lg":
      return { height: 56, paddingHorizontal: 32 };
    case "icon":
      return { height: 52, width: 52 };
    case "default":
    default:
      return { height: 52, paddingHorizontal: 24 };
  }
}

function getTextSizeStyle(size: ButtonSize): TextStyle {
  switch (size) {
    case "sm":
      return { fontSize: 13 };
    case "lg":
      return { fontSize: 17 };
    case "default":
    case "icon":
    default:
      return { fontSize: 15 };
  }
}

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      variant = "default",
      size = "default",
      style,
      textStyle,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          styles.button,
          getVariantStyle(variant),
          getSizeStyle(size),
          disabled && styles.disabled,
          pressed && styles.pressed,
          style,
        ]}
        disabled={disabled}
        {...props}
      >
        {typeof children === "string" ? (
          <Text
            style={[
              styles.buttonText,
              getTextVariantStyle(variant),
              getTextSizeStyle(size),
              textStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
  buttonText: {
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});

export { Button };
