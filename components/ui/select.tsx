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
import { colors } from "@/lib/theme";

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
        style={[styles.trigger, disabled && styles.disabled]}
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
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
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
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[700],
    marginBottom: 6,
  },
  trigger: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.stone[300],
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  triggerText: {
    fontSize: 16,
    flex: 1,
  },
  triggerTextSelected: {
    color: colors.stone[900],
  },
  triggerTextPlaceholder: {
    color: colors.stone[400],
  },
  chevron: {
    color: colors.stone[400],
    fontSize: 16,
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
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.stone[200],
  },
  dropdownHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.stone[200],
  },
  dropdownHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.stone[900],
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: colors.primary[50],
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  optionTextDefault: {
    color: colors.stone[900],
  },
  optionTextSelected: {
    color: colors.primary[700],
    fontWeight: "600",
  },
  checkmark: {
    color: colors.primary[600],
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: colors.stone[100],
    marginHorizontal: 16,
  },
});

export { Select };
