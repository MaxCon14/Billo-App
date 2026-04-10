import React from "react";
import {
  View,
  Text,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { colors } from "@/lib/theme";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

function getVariantStyle(variant: BadgeVariant): ViewStyle {
  switch (variant) {
    case "secondary":
      return { backgroundColor: colors.stone[200] };
    case "destructive":
      return { backgroundColor: colors.red[100] };
    case "outline":
      return {
        borderWidth: 1,
        borderColor: colors.stone[300],
        backgroundColor: colors.transparent,
      };
    case "default":
    default:
      return { backgroundColor: colors.primary[100] };
  }
}

function getTextVariantStyle(variant: BadgeVariant): TextStyle {
  switch (variant) {
    case "secondary":
    case "outline":
      return { color: colors.stone[700] };
    case "destructive":
      return { color: colors.red[800] };
    case "default":
    default:
      return { color: colors.primary[800] };
  }
}

const Badge = React.forwardRef<React.ElementRef<typeof View>, BadgeProps>(
  ({ variant = "default", style, textStyle, children, ...props }, ref) => (
    <View
      ref={ref}
      style={[styles.badge, getVariantStyle(variant), style]}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          style={[styles.badgeText, getTextVariantStyle(variant), textStyle]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  )
);

Badge.displayName = "Badge";

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export { Badge };
