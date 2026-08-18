// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/ui/separator_4.tsx
================================================================================

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "../../lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/ui/separator_2.tsx
================================================================================

import React from 'react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shrink-0 bg-gray-700 h-[1px] w-full pointer-events-none", className)}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/ui/separator_1.tsx
================================================================================


import React from 'react';

// A robust class name utility function to conditionally join class names.
// This is a foundational piece for building flexible UI components.
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Define the possible orientations for the separator.
// Using a TypeScript enum enhances type safety and API clarity.
export enum SeparatorOrientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

// Define a set of visual variants to provide design flexibility.
// This allows the separator to adapt to different contexts within the UI.
export enum SeparatorVariant {
  Default = 'default', // Standard solid line
  Subtle = 'subtle',   // A less prominent line
  Strong = 'strong',   // A more prominent line
  Dashed = 'dashed',   // A dashed line for visual distinction
  Gradient = 'gradient', // A modern, gradient-based separator
}

// The comprehensive props interface for the Separator component.
// It extends standard div attributes for maximum compatibility and adds custom props for enhanced functionality.
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Specifies the orientation of the separator line.
   * Can be 'horizontal' or 'vertical'.
   * @default SeparatorOrientation.Horizontal
   */
  orientation?: SeparatorOrientation;

  /**
   * Defines the visual style of the separator.
   * @default SeparatorVariant.Default
   */
  variant?: SeparatorVariant;

  /**
   * When true, the separator is treated as a purely decorative element and is
   * hidden from assistive technologies to reduce screen reader noise.
   * @default true
   */
  decorative?: boolean;

  /**
   * Controls the thickness of the separator line in pixels.
   * @default 1
   */
  thickness?: number;

  /**
   * An optional string of class names to apply to the component, allowing for
   * further customization via CSS.
   */
  className?: string;
}

/**
 * A highly customizable and accessible Separator component.
 * It can be rendered horizontally or vertically, with multiple visual styles,
 * and is built with accessibility and design system principles in mind.
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = SeparatorOrientation.Horizontal,
      variant = SeparatorVariant.Default,
      decorative = true,
      thickness = 1,
      ...props
    },
    ref
  ) => {
    // Determine the appropriate ARIA attributes based on the `decorative` prop.
    // This ensures the component is accessible and semantically correct.
    const accessibilityProps = decorative
      ? { role: 'none', 'aria-hidden': true }
      : { role: 'separator', 'aria-orientation': orientation };

    const isHorizontal = orientation === SeparatorOrientation.Horizontal;

    // Dynamically generate the class for the chosen variant.
    // This includes orientation-specific logic for the gradient variant.
    const getVariantClass = (): string => {
      switch (variant) {
        case SeparatorVariant.Default:
          return 'bg-gray-700';
        case SeparatorVariant.Subtle:
          return 'bg-gray-800';
        case SeparatorVariant.Strong:
          return 'bg-gray-500';
        case SeparatorVariant.Dashed:
          return 'bg-transparent border-dashed';
        case SeparatorVariant.Gradient:
          return isHorizontal
            ? 'bg-gradient-to-r from-transparent via-gray-500 to-transparent'
            : 'bg-gradient-to-b from-transparent via-gray-500 to-transparent';
        default:
          return 'bg-gray-700';
      }
    };

    // Dynamically calculate classes and styles based on orientation and thickness.
    const orientationClasses = isHorizontal ? 'w-full' : 'h-full';
    
    // For dashed variant, we use border property. For others, we use height/width.
    const thicknessStyle = isHorizontal
      ? { height: `${thickness}px`, borderTopWidth: variant === SeparatorVariant.Dashed ? `${thickness}px` : undefined }
      : { width: `${thickness}px`, borderLeftWidth: variant === SeparatorVariant.Dashed ? `${thickness}px` : undefined };
      
    const borderClass = variant === SeparatorVariant.Dashed ? 'border-gray-700' : '';

    // Render the final div element with all computed props, styles, and classes.
    return (
      <div
        ref={ref}
        style={thicknessStyle}
        className={cn(
          'shrink-0 pointer-events-none',
          orientationClasses,
          getVariantClass(),
          borderClass,
          className
        )}
        {...accessibilityProps}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/ui/separator_3.tsx
================================================================================

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "../../lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }