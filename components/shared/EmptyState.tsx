import React from "react";
import { Text, View } from "react-native";
import { Inbox } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn("flex-1 items-center justify-center px-8 py-12", className)}>
      <View className="mb-4 rounded-full bg-surface-100 p-4 dark:bg-dark-card">
        {icon || <Inbox size={32} color="#A8A29E" />}
      </View>
      <Text className="mb-2 text-center text-lg font-semibold text-stone-900 dark:text-stone-100">
        {title}
      </Text>
      <Text className="mb-6 text-center text-sm text-stone-500 dark:text-stone-400">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button onPress={onAction}>
          <Text className="font-semibold text-white">{actionLabel}</Text>
        </Button>
      )}
    </View>
  );
}
