import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  type ViewProps,
  type TextProps,
  type ModalProps,
} from "react-native";
import { cn } from "@/lib/utils";

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
        className="flex-1 items-center justify-center bg-black/50"
        onPress={() => onOpenChange(false)}
      >
        <Pressable onPress={() => {}}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};
Dialog.displayName = "Dialog";

// DialogContent
export interface DialogContentProps extends ViewProps {
  className?: string;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof View>,
  DialogContentProps
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "w-[85%] max-w-md bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-surface-200 dark:border-dark-border",
      className
    )}
    {...props}
  />
));
DialogContent.displayName = "DialogContent";

// DialogHeader
export interface DialogHeaderProps extends ViewProps {
  className?: string;
}

const DialogHeader = React.forwardRef<
  React.ElementRef<typeof View>,
  DialogHeaderProps
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("mb-4", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

// DialogTitle
export interface DialogTitleProps extends TextProps {
  className?: string;
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof Text>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn(
      "text-lg font-bold text-surface-900 dark:text-dark-text",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

// DialogDescription
export interface DialogDescriptionProps extends TextProps {
  className?: string;
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn(
      "text-sm text-surface-500 dark:text-dark-textSecondary mt-1",
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

// DialogFooter
export interface DialogFooterProps extends ViewProps {
  className?: string;
}

const DialogFooter = React.forwardRef<
  React.ElementRef<typeof View>,
  DialogFooterProps
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex-row justify-end gap-3 mt-6", className)}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
