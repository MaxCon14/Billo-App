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
        {icon || <Inbox size={28} color={colors.stone[400]} />}
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
    backgroundColor: colors.stone[100],
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[900],
  },
  description: {
    marginBottom: 24,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    color: colors.stone[400],
  },
  actionButton: {
    borderRadius: radius.full,
    backgroundColor: colors.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
  },
});
