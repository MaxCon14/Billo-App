import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { colors, radius } from "@/lib/theme";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ label, error, containerStyle, editable, style, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error ? styles.inputError : undefined,
            editable === false ? styles.disabled : undefined,
            style,
          ]}
          placeholderTextColor={colors.stone[400]}
          editable={editable}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
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
    fontSize: 13,
    fontWeight: "600",
    color: colors.stone[600],
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  input: {
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.stone[50],
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.stone[900],
  },
  inputFocused: {
    borderColor: colors.primary[500],
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.red[400],
    backgroundColor: colors.red[50],
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.stone[100],
  },
  errorText: {
    fontSize: 13,
    color: colors.red[500],
    marginTop: 6,
    fontWeight: "500",
  },
});
