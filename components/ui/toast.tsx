import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  View,
} from "react-native";
import { cn } from "@/lib/utils";

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

const TOAST_COLORS: Record<ToastType, { bg: string; text: string }> = {
  success: { bg: "bg-primary-600", text: "text-white" },
  error: { bg: "bg-red-500", text: "text-white" },
  info: { bg: "bg-surface-200 dark:bg-dark-card", text: "text-stone-900 dark:text-stone-100" },
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -100, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => onDismiss());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const colors = TOAST_COLORS[t.type];

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      <Pressable onPress={onDismiss}>
        <View className={cn("mx-4 mb-2 rounded-xl px-4 py-3 shadow-lg", colors.bg)}>
          <Text className={cn("text-sm font-medium", colors.text)}>{t.message}</Text>
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
      <View className="absolute left-0 right-0 top-14 z-50">
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
