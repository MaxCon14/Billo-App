import React from "react";
import { Pressable, Text, View } from "react-native";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/subscription";

interface CategoryBadgeProps {
  category: Category;
  selected: boolean;
  onPress: (category: Category) => void;
}

export function CategoryBadge({ category, selected, onPress }: CategoryBadgeProps) {
  return (
    <Pressable onPress={() => onPress(category)} className="active:opacity-80">
      <View
        className={cn(
          "flex-row items-center rounded-full px-3 py-2 border",
          selected
            ? "border-transparent"
            : "border-surface-200 bg-white dark:border-dark-border dark:bg-dark-card"
        )}
        style={selected ? { backgroundColor: category.color + "20", borderColor: category.color } : undefined}
      >
        <View
          style={{ backgroundColor: category.color }}
          className="mr-2 h-3 w-3 rounded-full"
        />
        <Text
          className={cn(
            "text-xs font-medium",
            selected ? "text-stone-900 dark:text-stone-100" : "text-stone-600 dark:text-stone-400"
          )}
        >
          {category.name}
        </Text>
      </View>
    </Pressable>
  );
}
