import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { colors, radius } from "@/lib/theme";

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
      return { height: 36, width: 36 };
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
      return 13;
    case "lg":
      return 22;
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
          <View style={styles.fallbackContainer}>
            <Text
              style={[styles.fallbackText, { fontSize: getTextSize(size) }]}
            >
              {fallback}
            </Text>
          </View>
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
    borderRadius: radius.full,
    overflow: "hidden",
    backgroundColor: colors.surfaceRaised,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  fallbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.surfaceRaised,
  },
  fallbackText: {
    fontFamily: "Syne_700Bold",
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: 0.5,
  },
});

export { Avatar };
