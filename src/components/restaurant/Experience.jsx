import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const OMAKASE_IMG = "https://media.base44.com/images/public/69c4afc75d0284fc64e49e47/94034c906_generated_b72e7551.png";

export default function Experience() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="experience" ref={ref} className="py-24 md:py-36 bg-secondary">
            <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-12 gap-6 md:gap-10">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1 }}
                        className="col-span-12 md:col-span-7"
                    >
                        <div className="relative overflow-hidden aspect-[16/10]">
                            <img
                                src={OMAKASE_IMG}
                                alt="Omakase sushi course arranged on rectangular plate"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="col-span-12 md:col-span-4 md:col-start-9 flex flex-col justify-center"
                    >
                        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                            The Omakase
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
                            Trust the
                            <br />
                            Chef
                        </h2>
                        <p className="font-body text-sm text-muted-foreground mt-6 leading-[1.8]">
                            Our Omakase is a 12-course journey through the season's finest.
                            Each course is a conversation between the Itamae and the ocean —
                            no two sittings are alike.
                        </p>
                        <div className="mt-10 space-y-4">
                            <div className="flex items-baseline justify-between py-3 border-b border-border">
                                <span className="font-display text-lg font-light">Omakase — 12 Courses</span>
                                <span className="font-body text-sm text-muted-foreground">$185 / seat</span>
                            </div>
                            <div className="flex items-baseline justify-between py-3 border-b border-border">
                                <span className="font-display text-lg font-light">Premium — 18 Courses</span>
                                <span className="font-body text-sm text-muted-foreground">$285 / seat</span>
                            </div>
                            <div className="flex items-baseline justify-between py-3 border-b border-border">
                                <span className="font-display text-lg font-light">Chef's Table — Private</span>
                                <span className="font-body text-sm text-muted-foreground">Inquiry</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}