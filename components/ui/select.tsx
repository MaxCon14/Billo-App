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
import { colors, shadows, radius } from "@/lib/theme";

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
    fontSize: 13,
    fontWeight: "600",
    color: colors.stone[600],
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  trigger: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.stone[50],
    paddingHorizontal: 16,
  },
  triggerPressed: {
    backgroundColor: colors.stone[100],
  },
  disabled: {
    opacity: 0.4,
  },
  triggerText: {
    fontSize: 15,
    flex: 1,
  },
  triggerTextSelected: {
    color: colors.stone[900],
    fontWeight: "500",
  },
  triggerTextPlaceholder: {
    color: colors.stone[400],
  },
  chevron: {
    color: colors.stone[400],
    fontSize: 14,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdown: {
    width: "85%",
    maxHeight: "60%",
    backgroundColor: colors.white,
    borderRadius: radius["2xl"],
    overflow: "hidden",
    ...shadows.lg,
  },
  dropdownHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.stone[100],
  },
  dropdownHeaderText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.stone[900],
    letterSpacing: -0.2,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: colors.primary[50],
  },
  optionPressed: {
    backgroundColor: colors.stone[50],
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },
  optionTextDefault: {
    color: colors.stone[800],
  },
  optionTextSelected: {
    color: colors.primary[600],
    fontWeight: "600",
  },
  checkmark: {
    color: colors.primary[600],
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: colors.stone[100],
    marginHorizontal: 20,
  },
});

export { Select };
