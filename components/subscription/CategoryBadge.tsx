import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, typography } from "@/lib/theme";
import type { Category } from "@/types/subscription";

interface CategoryBadgeProps {
  category: Category;
  selected: boolean;
  onPress: (category: Category) => void;
}

export function CategoryBadge({ category, selected, onPress }: CategoryBadgeProps) {
  return (
    <Pressable
      onPress={() => onPress(category)}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View
        style={[
          styles.badge,
          selected
            ? {
                backgroundColor: colors.accent.yellow,
                borderColor: colors.accent.yellow,
              }
            : styles.badgeUnselected,
        ]}
      >
        <View style={[styles.dot, { backgroundColor: category.color }]} />
        <Text
          style={[
            styles.label,
            selected ? styles.labelSelected : styles.labelUnselected,
          ]}
        >
          {category.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
  },
  badgeUnselected: {
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
  },
  dot: {
    marginRight: 8,
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  label: {
    fontFamily: typography.body.fontFamily,
    fontSize: 13,
    fontWeight: "500",
  },
  labelSelected: {
    color: colors.background,
  },
  labelUnselected: {
    color: colors.muted,
  },
});
