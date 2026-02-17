import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-white text-black hover:bg-gray-200': variant === 'default',
            'border border-gray-700 bg-transparent hover:bg-gray-800 text-white': variant === 'outline',
            'hover:bg-gray-800 text-white': variant === 'ghost',
            'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700': variant === 'destructive',
          },
          {
            'h-11 px-6 py-2': size === 'default',
            'h-9 px-4 text-sm': size === 'sm',
            'h-12 px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
