import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fetchSheet } from "@/lib/google-sheets";
import { InlineMarkdown } from "@/lib/InlineMarkdown";

const PILLARS = [
    { number: "01", title: "Quality" },
    { number: "02", title: "Craftsmanship" },
    { number: "03", title: "Experience" },
];

const FALLBACK_PARAGRAPHS = [
    "Tsuru Sushi was established since 1997 serving sushi in the heart of downtown San Leandro. Our family and long time staff are excited to introduce and in some cases; re-introduce some of our guests' favorites.",
    "Norman's own creation of East 14th Roll which combines prawn tempura, tobiko, avocado and his spicy sauce. Other hidden gems include Baby Lobster Tails, Lion King Roll, Spider Roll, which is our soft shell crab enveloped in our special batter, and Spicy Tuna Roll to name just a few.",
    "Look over our menu and you will find a large and appetizing selection of Vegetarian Sushi, as well as Bento Boxes and Lunch and Dinner Plates. We welcome parties large and small, catering as well as \"To Go\" orders.",
];

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAu9nbAJtnbgol4C2LNlNh3HyxJs84W8mfVEtz_r44KzApHlOSFQdzdD_a_5nH7APxsWgu66RWtER/pub?gid=699016301&single=true&output=csv";

export default function Provenance() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [paragraphs, setParagraphs] = useState(FALLBACK_PARAGRAPHS);

    useEffect(() => {
        fetchSheet(SHEET_URL)
            .then((rows) => {
                const sorted = rows
                    .filter((r) => r.paragraph)
                    .sort((a, b) => (parseInt(a.sort_order) || 0) - (parseInt(b.sort_order) || 0))
                    .map((r) => r.paragraph);
                if (sorted.length > 0) setParagraphs(sorted);
            })
            .catch(() => {});
    }, []);

    return (
        <section id="about" ref={ref} className="snap-start min-h-screen flex flex-col justify-center py-16 md:py-24 bg-foreground text-background">
            <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-12 gap-6 md:gap-10">

                    {/* Left column — heading + story */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="col-span-12 md:col-span-5 md:col-start-2"
                    >
                        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-background/50 mb-4">
                            About Us
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
                            Our
                            <br />
                            Story
                        </h2>
                        <div className="my-8 h-px w-full bg-background/10" />
                        {paragraphs.map((text, i) => (
                            <p key={i} className={`font-body text-sm text-background/60 leading-[1.8] max-w-sm ${i > 0 ? "mt-4" : ""}`}>
                                <InlineMarkdown text={text} />
                            </p>
                        ))}

                        {/* Year highlight */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-10 flex items-baseline gap-4"
                        >
                            <span className="font-display text-6xl md:text-7xl font-light text-[#ef8239]">
                                1997
                            </span>
                            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-background/60">
                                Est.
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Right column — pillars */}
                    <div className="col-span-12 md:col-span-5 md:col-start-8 mt-12 md:mt-0 flex flex-col justify-center">
                        {PILLARS.map((pillar, i) => (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, x: 30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                                className="relative py-8 border-b border-background/10 group"
                            >
                                <div className="absolute left-0 top-0 w-px h-full bg-background/10" />
                                <div className="absolute -left-1 top-1/2 w-2 h-px bg-[#ef8239]" />

                                <div className="flex items-baseline gap-4 justify-center">
                                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-[#ef8239]">
                                        {pillar.number}
                                    </span>
                                    <h3 className="font-display text-3xl md:text-4xl font-light">
                                        {pillar.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}