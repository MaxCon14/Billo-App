import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  type ViewProps,
} from "react-native";
import { cn } from "@/lib/utils";

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
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  label,
  disabled = false,
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <View className={cn("w-full", className)} {...props}>
      {label && (
        <Text className="text-sm font-medium text-surface-700 dark:text-dark-textSecondary mb-1.5">
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => !disabled && setOpen(true)}
        className={cn(
          "h-12 flex-row items-center justify-between rounded-xl border border-surface-300 dark:border-dark-border bg-white dark:bg-dark-card px-4",
          disabled && "opacity-50"
        )}
      >
        <Text
          className={cn(
            "text-base flex-1",
            selectedOption
              ? "text-surface-900 dark:text-dark-text"
              : "text-surface-400 dark:text-dark-textSecondary"
          )}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className="text-surface-400 dark:text-dark-textSecondary text-base ml-2">
          {"\u25BE"}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => setOpen(false)}
        >
          <View className="w-[85%] max-w-md max-h-[60%] bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-surface-200 dark:border-dark-border">
            {label && (
              <View className="px-4 pt-4 pb-2 border-b border-surface-200 dark:border-dark-border">
                <Text className="text-base font-bold text-surface-900 dark:text-dark-text">
                  {label}
                </Text>
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
                    className={cn(
                      "px-4 py-3 flex-row items-center",
                      isSelected && "bg-primary-50 dark:bg-primary-900/20"
                    )}
                  >
                    <Text
                      className={cn(
                        "text-base flex-1",
                        isSelected
                          ? "text-primary-700 dark:text-primary-300 font-semibold"
                          : "text-surface-900 dark:text-dark-text"
                      )}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Text className="text-primary-600 dark:text-primary-400 text-base">
                        {"\u2713"}
                      </Text>
                    )}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-surface-100 dark:bg-dark-border mx-4" />
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

Select.displayName = "Select";

export { Select };
