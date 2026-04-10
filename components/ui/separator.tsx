import React from "react";
import { View, StyleSheet, type ViewProps, type ViewStyle } from "react-native";
import { colors } from "@/lib/theme";

export interface SeparatorProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  style?: ViewStyle;
}

const Separator = React.forwardRef<React.ElementRef<typeof View>, SeparatorProps>(
  ({ orientation = "horizontal", style, ...props }, ref) => (
    <View
      ref={ref}
      style={[
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export { Separator };

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: colors.stone[200],
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: "100%",
    backgroundColor: colors.stone[200],
  },
});
