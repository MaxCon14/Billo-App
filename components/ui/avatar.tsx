import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { colors } from "@/lib/theme";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends ViewProps {
  src?: string;
  fallback: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

function getSizeStyle(size: AvatarSize): ViewStyle {
  switch (size) {
    case "sm":
      return { height: 32, width: 32 };
    case "lg":
      return { height: 64, width: 64 };
    case "md":
    default:
      return { height: 48, width: 48 };
  }
}

function getTextSize(size: AvatarSize): number {
  switch (size) {
    case "sm":
      return 12;
    case "lg":
      return 20;
    case "md":
    default:
      return 16;
  }
}

const Avatar = React.forwardRef<React.ElementRef<typeof View>, AvatarProps>(
  ({ src, fallback, size = "md", style, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    const showImage = src && !imageError;

    return (
      <View
        ref={ref}
        style={[styles.avatar, getSizeStyle(size), style]}
        {...props}
      >
        {showImage ? (
          <Image
            source={{ uri: src }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Text
            style={[styles.fallbackText, { fontSize: getTextSize(size) }]}
          >
            {fallback}
          </Text>
        )}
      </View>
    );
  }
);

Avatar.displayName = "Avatar";

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: colors.primary[100],
  },
  image: {
    height: "100%",
    width: "100%",
  },
  fallbackText: {
    fontWeight: "bold",
    color: colors.primary[700],
  },
});

export { Avatar };
