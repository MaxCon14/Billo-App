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
    height: 1,
    width: "100%",
    backgroundColor: colors.stone[100],
  },
  vertical: {
    width: 1,
    height: "100%",
    backgroundColor: colors.stone[100],
  },
});
