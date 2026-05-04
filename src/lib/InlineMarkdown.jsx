import React from "react"

// Renders **bold** and __underline__ markdown inline.
export function InlineMarkdown({ text }) {
    if (!text) return null
    // Split on **bold** OR __underline__ — capture group keeps delimiters in result
    const parts = text.split(/(\*\*.+?\*\*|__.+?__)/g)
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <strong key={i} style={{ fontWeight: 900, fontSize: "1.15em" }}>
                            {part.slice(2, -2)}
                        </strong>
                    )
                }
                if (part.startsWith("__") && part.endsWith("__")) {
                    return (
                        <span key={i} style={{ textDecoration: "underline" }}>
                            {part.slice(2, -2)}
                        </span>
                    )
                }
                return part
            })}
        </>
    )
}
