import { useEffect, useRef } from 'react';

/**
 * Traps focus within the element when isActive is true
 * Used for maintaining accessibility in Modals and Overlays
 */
export const useFocusTrap = (isActive: boolean) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) return;

        const element = ref.current;
        if (!element) return;

        // Find all focusable elements
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        element.addEventListener('keydown', handleTab);

        // Initial focus
        firstElement.focus();

        return () => {
            element.removeEventListener('keydown', handleTab);
        };
    }, [isActive]);

    return ref;
};

interface KeyboardNavigationOptions {
    onEscape?: () => void;
    enabled?: boolean;
}

/**
 * Handles keyboard navigation events like Escape
 */
export const useKeyboardNavigation = ({ onEscape, enabled = true }: KeyboardNavigationOptions) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onEscape) {
                onEscape();
            }
        };

        // Attach to document to ensure Escape works even if focus is lost momentarily,
        // which is standard behavior for Modals.
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled, onEscape]);

    return ref;
};
