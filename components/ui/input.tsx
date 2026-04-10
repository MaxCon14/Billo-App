import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { colors } from "@/lib/theme";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ label, error, containerStyle, editable, style, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            error ? styles.inputError : undefined,
            editable === false ? styles.disabled : undefined,
            style,
          ]}
          placeholderTextColor="#9CA3AF"
          editable={editable}
          {...props}
        />
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };

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
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.stone[300],
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.stone[900],
  },
  inputError: {
    borderColor: colors.red[500],
  },
  disabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: 14,
    color: colors.red[500],
    marginTop: 4,
  },
});
