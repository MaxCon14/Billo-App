import React from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Inbox } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/theme";

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
        {icon || <Inbox size={32} color={colors.stone[400]} />}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <Button onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Button>
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
    marginBottom: 16,
    borderRadius: 9999,
    backgroundColor: colors.stone[100],
    padding: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: colors.stone[900],
  },
  description: {
    marginBottom: 24,
    textAlign: "center",
    fontSize: 14,
    color: colors.stone[500],
  },
  actionText: {
    fontWeight: "600",
    color: colors.white,
  },
});
