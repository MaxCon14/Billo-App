import React, { useState } from "react";
import { Image, type ImageStyle, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { colors } from "@/lib/theme";
import { getLogoUrl, getFallbackLogoUrl } from "@/lib/logoService";

interface LogoProps {
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  size?: number;
  style?: ViewStyle;
}

function hashToColor(str: string): string {
  const palette = [
    colors.accent.yellow,
    colors.destructive,
    colors.accent.green,
    colors.accent.yellow,
    "#0D9488",
    "#8B5CF6",
    colors.accent.pink,
    "#F97316",
    "#06B6D4",
    "#6366F1",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function Logo({ name, logoUrl, websiteUrl, size = 40, style: styleProp }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const bgColor = hashToColor(name);
  const initial = name.charAt(0).toUpperCase();
  const fontSize = size * 0.42;

  // Priority: explicit logoUrl > Google favicon (by url or name) > Clearbit fallback > initial
  const faviconUrl = getLogoUrl(websiteUrl, name);
  const clearbitUrl = getFallbackLogoUrl(websiteUrl, name);

  const resolvedUrl = logoUrl ?? faviconUrl;
  const showFallbackImg = imgError && clearbitUrl && !fallbackError;
  const showInitial = (!resolvedUrl && !showFallbackImg) || (imgError && !showFallbackImg);

  if (resolvedUrl && !imgError) {
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: "hidden",
          },
          styleProp,
        ]}
      >
        <Image
          source={{ uri: resolvedUrl }}
          style={
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.surfaceRaised,
            } as ImageStyle
          }
          onError={() => setImgError(true)}
        />
      </View>
    );
  }

  if (showFallbackImg) {
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: "hidden",
          },
          styleProp,
        ]}
      >
        <Image
          source={{ uri: clearbitUrl! }}
          style={
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.surfaceRaised,
            } as ImageStyle
          }
          onError={() => setFallbackError(true)}
        />
      </View>
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
      <Text style={[styles.initial, { fontSize, lineHeight: fontSize * 1.2 }]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontFamily: 'Syne_700Bold',
    color: colors.white,
    textAlign: "center",
  },
});
