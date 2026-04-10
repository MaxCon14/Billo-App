import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  type ViewProps,
  type TextProps,
  type ModalProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { colors } from "@/lib/theme";

// Dialog (root wrapper)
export interface DialogProps extends Omit<ModalProps, "children"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
  ...props
}) => {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
      statusBarTranslucent
      {...props}
    >
      <Pressable
        style={styles.overlay}
        onPress={() => onOpenChange(false)}
      >
        <Pressable onPress={() => {}}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
};
Dialog.displayName = "Dialog";

// DialogContent
export interface DialogContentProps extends ViewProps {
  style?: ViewStyle;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof View>,
  DialogContentProps
>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.dialogContent, style]} {...props} />
));
DialogContent.displayName = "DialogContent";

// DialogHeader
export interface DialogHeaderProps extends ViewProps {
  style?: ViewStyle;
}

const DialogHeader = React.forwardRef<
  React.ElementRef<typeof View>,
  DialogHeaderProps
>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.dialogHeader, style]} {...props} />
));
DialogHeader.displayName = "DialogHeader";

// DialogTitle
export interface DialogTitleProps extends TextProps {
  style?: TextStyle;
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof Text>,
  DialogTitleProps
>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.dialogTitle, style]} {...props} />
));
DialogTitle.displayName = "DialogTitle";

// DialogDescription
export interface DialogDescriptionProps extends TextProps {
  style?: TextStyle;
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  DialogDescriptionProps
>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.dialogDescription, style]} {...props} />
));
DialogDescription.displayName = "DialogDescription";

// DialogFooter
export interface DialogFooterProps extends ViewProps {
  style?: ViewStyle;
}

const DialogFooter = React.forwardRef<
  React.ElementRef<typeof View>,
  DialogFooterProps
>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.dialogFooter, style]} {...props} />
));
DialogFooter.displayName = "DialogFooter";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dialogContent: {
    width: "85%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.stone[200],
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  dialogHeader: {
    marginBottom: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.stone[900],
  },
  dialogDescription: {
    fontSize: 14,
    color: colors.stone[500],
    marginTop: 4,
  },
  dialogFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
});

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
