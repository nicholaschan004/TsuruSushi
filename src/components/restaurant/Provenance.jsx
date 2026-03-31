import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PILLARS = [
    {
        number: "01",
        title: "Quality",
        description: "Only the finest cuts make it to our counter — sourced daily, never frozen.",
    },
    {
        number: "02",
        title: "Tradition",
        description: "Rooted in classical technique passed down through generations of itamae.",
    },
    {
        number: "03",
        title: "Craft",
        description: "Every piece is shaped by hand with precision, patience, and respect for the ingredient.",
    },
];

export default function Provenance() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

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
                        <p className="font-body text-sm text-background/60 leading-[1.8] max-w-sm">
                            Tsuru Sushi has been established since 1997, with an unwavering focus on quality, tradition, and the art of sushi.
                        </p>
                        <p className="font-body text-sm text-background/60 mt-4 leading-[1.8] max-w-sm">
                            What began as a small neighborhood counter has grown into a destination for those who appreciate the craft of true Edomae sushi.
                        </p>

                        {/* Year highlight */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-10 flex items-baseline gap-4"
                        >
                            <span className="font-display text-6xl md:text-7xl font-light text-primary">
                                1997
                            </span>
                            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-background/40">
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
                                <div className="absolute -left-1 top-1/2 w-2 h-px bg-primary" />

                                <div className="pl-6">
                                    <div className="flex items-baseline gap-4 mb-2">
                                        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">
                                            {pillar.number}
                                        </span>
                                        <h3 className="font-display text-xl md:text-2xl font-light">
                                            {pillar.title}
                                        </h3>
                                    </div>
                                    <p className="font-body text-xs text-background/50 leading-[1.8]">
                                        {pillar.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}