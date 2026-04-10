import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { colors } from "@/lib/theme";

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
      return { backgroundColor: colors.red[500] };
    case "outline":
      return {
        borderWidth: 1,
        borderColor: colors.stone[300],
        backgroundColor: colors.transparent,
      };
    case "secondary":
      return { backgroundColor: colors.stone[200] };
    case "ghost":
      return { backgroundColor: colors.transparent };
    case "default":
    default:
      return { backgroundColor: colors.primary[600] };
  }
}

function getTextVariantStyle(variant: ButtonVariant): TextStyle {
  switch (variant) {
    case "default":
    case "destructive":
      return { color: colors.white };
    case "outline":
    case "secondary":
    case "ghost":
    default:
      return { color: colors.stone[900] };
  }
}

function getSizeStyle(size: ButtonSize): ViewStyle {
  switch (size) {
    case "sm":
      return { height: 36, paddingHorizontal: 16 };
    case "lg":
      return { height: 56, paddingHorizontal: 32 };
    case "icon":
      return { height: 48, width: 48 };
    case "default":
    default:
      return { height: 48, paddingHorizontal: 24 };
  }
}

function getTextSizeStyle(size: ButtonSize): TextStyle {
  switch (size) {
    case "sm":
      return { fontSize: 14 };
    case "lg":
      return { fontSize: 18 };
    case "default":
    case "icon":
    default:
      return { fontSize: 16 };
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
    borderRadius: 12,
  },
  buttonText: {
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});

export { Button };
