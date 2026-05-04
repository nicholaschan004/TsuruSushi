import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

// Renders **bold** markdown inline. Use in place of a plain text node.
export function InlineMarkdown({ text }) {
    if (!text) return null
    const parts = text.split(/\*\*(.+?)\*\*/g)
    return parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    )
}
