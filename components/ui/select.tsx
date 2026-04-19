import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { colors, radius } from "@/lib/theme";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<ViewProps, "children"> {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  label,
  disabled = false,
  style,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={[styles.container, style]} {...props}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Pressable
        onPress={() => !disabled && setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          disabled && styles.disabled,
          pressed && !disabled && styles.triggerPressed,
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            selectedOption
              ? styles.triggerTextSelected
              : styles.triggerTextPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.chevron}>{"\u25BE"}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.dropdown}>
            {label && (
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownHeaderText}>{label}</Text>
              </View>
            )}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onValueChange(item.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      isSelected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected
                          ? styles.optionTextSelected
                          : styles.optionTextDefault,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Text style={styles.checkmark}>{"\u2713"}</Text>
                    )}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

Select.displayName = "Select";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontFamily: "Syne_700Bold",
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  trigger: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
  },
  triggerPressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.4,
  },
  triggerText: {
    fontFamily: "Syne_400Regular",
    fontSize: 15,
    flex: 1,
  },
  triggerTextSelected: {
    color: colors.foreground,
    fontWeight: "500",
  },
  triggerTextPlaceholder: {
    color: colors.muted,
  },
  chevron: {
    color: colors.muted,
    fontSize: 14,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  dropdown: {
    width: "85%",
    maxHeight: "60%",
    backgroundColor: colors.surface,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  dropdownHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownHeaderText: {
    fontFamily: "Syne_700Bold",
    fontSize: 17,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: -0.2,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: colors.surfaceRaised,
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionText: {
    fontFamily: "Syne_400Regular",
    fontSize: 15,
    flex: 1,
  },
  optionTextDefault: {
    color: colors.foreground,
  },
  optionTextSelected: {
    color: colors.accent.yellow,
    fontWeight: "600",
  },
  checkmark: {
    color: colors.accent.yellow,
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
});

export { Select };
