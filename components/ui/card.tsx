import React from "react";
import {
  View,
  Text,
  StyleSheet,
  type ViewProps,
  type TextProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { colors, shadows, radius } from "@/lib/theme";

// Card
export interface CardProps extends ViewProps {
  style?: ViewStyle;
}

const Card = React.forwardRef<React.ElementRef<typeof View>, CardProps>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.card, style]} {...props} />
  )
);
Card.displayName = "Card";

// CardHeader
export interface CardHeaderProps extends ViewProps {
  style?: ViewStyle;
}

const CardHeader = React.forwardRef<
  React.ElementRef<typeof View>,
  CardHeaderProps
>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardHeader, style]} {...props} />
));
CardHeader.displayName = "CardHeader";

// CardTitle
export interface CardTitleProps extends TextProps {
  style?: TextStyle;
}

const CardTitle = React.forwardRef<
  React.ElementRef<typeof Text>,
  CardTitleProps
>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardTitle, style]} {...props} />
));
CardTitle.displayName = "CardTitle";

// CardDescription
export interface CardDescriptionProps extends TextProps {
  style?: TextStyle;
}

const CardDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  CardDescriptionProps
>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.cardDescription, style]} {...props} />
));
CardDescription.displayName = "CardDescription";

// CardContent
export interface CardContentProps extends ViewProps {
  style?: ViewStyle;
}

const CardContent = React.forwardRef<
  React.ElementRef<typeof View>,
  CardContentProps
>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardContent, style]} {...props} />
));
CardContent.displayName = "CardContent";

// CardFooter
export interface CardFooterProps extends ViewProps {
  style?: ViewStyle;
}

const CardFooter = React.forwardRef<
  React.ElementRef<typeof View>,
  CardFooterProps
>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.cardFooter, style]} {...props} />
));
CardFooter.displayName = "CardFooter";

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 20,
    ...shadows.md,
  },
  cardHeader: {
    paddingBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[900],
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.stone[500],
    marginTop: 4,
    lineHeight: 20,
  },
  cardContent: {
    paddingVertical: 4,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
  },
});

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
