import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Inbox } from "lucide-react-native";
import { colors, radius } from "@/lib/theme";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  style: styleProp,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, styleProp]}>
      <View style={styles.iconWrapper}>
        {icon || <Inbox size={28} color={colors.muted} />}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionPressed,
          ]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    marginBottom: 20,
    borderRadius: 32,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: colors.foreground,
  },
  description: {
    marginBottom: 24,
    textAlign: "center",
    fontFamily: 'Syne_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
  },
  actionButton: {
    borderRadius: radius.full,
    backgroundColor: colors.accent.yellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionText: {
    fontFamily: 'Syne_700Bold',
    fontSize: 15,
    color: colors.black,
  },
});
