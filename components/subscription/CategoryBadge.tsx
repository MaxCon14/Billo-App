import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";
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
      style={({ pressed }) => pressed ? styles.pressed : undefined}
    >
      <View
        style={[
          styles.badge,
          selected
            ? { backgroundColor: category.color + "20", borderColor: category.color }
            : styles.badgeUnselected,
        ]}
      >
        <View style={[styles.dot, { backgroundColor: category.color }]} />
        <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
          {category.name}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  badgeUnselected: {
    borderColor: colors.stone[200],
    backgroundColor: colors.white,
  },
  dot: {
    marginRight: 8,
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  labelSelected: {
    color: colors.stone[900],
  },
  labelUnselected: {
    color: colors.stone[600],
  },
});
