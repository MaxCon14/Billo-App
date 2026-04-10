import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, shadows, radius } from "@/lib/theme";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_ICON: Record<ToastType, string> = {
  success: "\u2713",
  error: "\u2717",
  info: "\u2139",
};

const TOAST_BG: Record<ToastType, string> = {
  success: colors.white,
  error: colors.white,
  info: colors.white,
};

const TOAST_ICON_BG: Record<ToastType, string> = {
  success: colors.green[50],
  error: colors.red[50],
  info: colors.primary[50],
};

const TOAST_ICON_COLOR: Record<ToastType, string> = {
  success: colors.green[600],
  error: colors.red[500],
  info: colors.primary[600],
};

const TOAST_TEXT: Record<ToastType, string> = {
  success: colors.stone[800],
  error: colors.stone[800],
  info: colors.stone[800],
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,
        stiffness: 150,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      <Pressable onPress={onDismiss}>
        <View style={styles.toastBox}>
          <View
            style={[
              styles.toastIconContainer,
              { backgroundColor: TOAST_ICON_BG[t.type] },
            ]}
          >
            <Text
              style={[styles.toastIcon, { color: TOAST_ICON_COLOR[t.type] }]}
            >
              {TOAST_ICON[t.type]}
            </Text>
          </View>
          <Text
            style={[styles.toastText, { color: TOAST_TEXT[t.type] }]}
            numberOfLines={2}
          >
            {t.message}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 48,
    zIndex: 50,
    alignItems: "center",
  },
  toastBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
    minWidth: 280,
    ...shadows.lg,
  },
  toastIconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  toastIcon: {
    fontSize: 14,
    fontWeight: "700",
  },
  toastText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    letterSpacing: 0.1,
  },
});
