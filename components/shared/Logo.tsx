import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { cn } from "@/lib/utils";

interface LogoProps {
  name: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
}

function hashToColor(str: string): string {
  const colors = [
    "#E24B4A", "#7F77DD", "#639922", "#378ADD", "#1D9E75",
    "#D85A30", "#D4537E", "#BA7517", "#0D9488", "#6366F1",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Logo({ name, logoUrl, size = 40, className }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const bgColor = hashToColor(name);
  const initial = name.charAt(0).toUpperCase();
  const fontSize = size * 0.4;

  if (logoUrl && !imgError) {
    return (
      <Image
        source={{ uri: logoUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className={cn("bg-surface-100", className)}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
      }}
      className={cn("items-center justify-center", className)}
    >
      <Text style={{ fontSize }} className="font-bold text-white">
        {initial}
      </Text>
    </View>
  );
}
