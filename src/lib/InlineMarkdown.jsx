import React from "react"

// Renders **bold** and __underline__ markdown inline. Patterns can be nested:
//   **__word__**  → bold + underlined
//   __**word**__  → underlined + bold
export function InlineMarkdown({ text }) {
    if (!text) return null
    const parts = text.split(/(\*\*.+?\*\*|__.+?__)/g)
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                        <strong key={i} style={{ fontWeight: 900, fontSize: "1.15em" }}>
                            <InlineMarkdown text={part.slice(2, -2)} />
                        </strong>
                    )
                }
                if (part.startsWith("__") && part.endsWith("__")) {
                    return (
                        <span key={i} style={{ textDecoration: "underline" }}>
                            <InlineMarkdown text={part.slice(2, -2)} />
                        </span>
                    )
                }
                return part
            })}
        </>
    )
}
