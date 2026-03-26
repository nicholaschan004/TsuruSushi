import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SOURCES = [
    {
        location: "Tsukiji Market",
        region: "Tokyo, Japan",
        item: "Bluefin Tuna",
        distance: "5,700 mi",
    },
    {
        location: "Hokkaido Coast",
        region: "Northern Japan",
        item: "Uni & Ikura",
        distance: "6,200 mi",
    },
    {
        location: "Monterey Bay",
        region: "California, USA",
        item: "Albacore & Hirame",
        distance: "Local",
    },
    {
        location: "Suruga Bay",
        region: "Shizuoka, Japan",
        item: "Kinmedai & Aji",
        distance: "5,900 mi",
    },
];

export default function Provenance() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="provenance" ref={ref} className="py-24 md:py-36 bg-foreground text-background">
            <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-5 md:col-start-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-background/50 mb-4">
                                The Source
                            </p>
                            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
                                From Ocean
                                <br />
                                to Counter
                            </h2>
                            <p className="font-body text-sm text-background/60 mt-6 leading-[1.8] max-w-sm">
                                Every piece tells a story of origin. We trace our fish from
                                the moment it leaves the water to the moment it meets the rice.
                            </p>
                        </motion.div>
                    </div>

                    <div className="col-span-12 md:col-span-5 md:col-start-8 mt-12 md:mt-0">
                        {SOURCES.map((source, i) => (
                            <motion.div
                                key={source.location}
                                initial={{ opacity: 0, x: 30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: i * 0.12 }}
                                className="relative py-6 border-b border-background/10 group"
                            >
                                {/* Blade edge connector line */}
                                <div className="absolute left-0 top-0 w-px h-full bg-background/10" />
                                <div className="absolute -left-1 top-1/2 w-2 h-px bg-primary" />

                                <div className="pl-6">
                                    <div className="flex items-baseline justify-between">
                                        <h3 className="font-display text-xl md:text-2xl font-light">
                                            {source.location}
                                        </h3>
                                        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-background/40">
                                            {source.distance}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between mt-1">
                                        <span className="font-body text-xs text-background/50">
                                            {source.region}
                                        </span>
                                        <span className="font-body text-xs text-primary">
                                            {source.item}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}