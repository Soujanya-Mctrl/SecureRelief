import * as React from "react"
import { cn } from "@/lib/utils"
// Note: I am not installing Radix Slot right now. 
// I will remove Slot and just use standard button for simplicity unless requested.
// Actually, standardizing on simple props is better without extra deps.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
                        'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
                        'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
                        'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
                        'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
                        'text-primary underline-offset-4 hover:underline': variant === 'link',
                        'h-10 px-4 py-2': size === 'default',
                        'h-9 rounded-md px-3': size === 'sm',
                        'h-11 rounded-md px-8': size === 'lg',
                        'h-10 w-10': size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
