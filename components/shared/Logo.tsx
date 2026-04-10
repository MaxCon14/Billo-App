import React, { useState } from "react";
import { Image, type ImageStyle, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { colors } from "@/lib/theme";

interface LogoProps {
  name: string;
  logoUrl?: string | null;
  size?: number;
  style?: ViewStyle;
}

function hashToColor(str: string): string {
  const palette = [
    "#E24B4A", "#7F77DD", "#639922", "#378ADD", "#1D9E75",
    "#D85A30", "#D4537E", "#BA7517", "#0D9488", "#6366F1",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function Logo({ name, logoUrl, size = 40, style: styleProp }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const bgColor = hashToColor(name);
  const initial = name.charAt(0).toUpperCase();
  const fontSize = size * 0.4;

  if (logoUrl && !imgError) {
    return (
      <Image
        source={{ uri: logoUrl }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.stone[100],
          } as ImageStyle,
          styleProp as ImageStyle,
        ]}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
        styleProp,
      ]}
    >
      <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontWeight: "700",
    color: colors.white,
  },
});
