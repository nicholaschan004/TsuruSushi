import React from "react"

export function InlineMarkdown({ text }) {
    if (!text) return null
    const parts = text.split(/\*\*(.+?)\*\*/g)
    if (parts.length === 1) return <>{text}</>
    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 1
                    ? <strong key={i} style={{ fontWeight: 700 }}>{part}</strong>
                    : part
            )}
        </>
    )
}
