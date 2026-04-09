import React, { useState } from "react";
import { View, Text, Image, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "items-center justify-center rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const avatarTextVariants = cva("font-bold text-primary-700 dark:text-primary-300", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-base",
      lg: "text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface AvatarProps
  extends ViewProps,
    VariantProps<typeof avatarVariants> {
  src?: string;
  fallback: string;
  className?: string;
}

const Avatar = React.forwardRef<React.ElementRef<typeof View>, AvatarProps>(
  ({ src, fallback, size, className, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    const showImage = src && !imageError;

    return (
      <View
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {showImage ? (
          <Image
            source={{ uri: src }}
            className="h-full w-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Text className={cn(avatarTextVariants({ size }))}>
            {fallback}
          </Text>
        )}
      </View>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
