import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HERO_IMG = "https://media.base44.com/images/public/69c4afc75d0284fc64e49e47/6f957d3e2_generated_38c80c72.png";

export default function Hero() {
    const { scrollY } = useScroll();
    const imgY = useTransform(scrollY, [0, 800], [0, 200]);
    const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const splitLeft = useTransform(scrollY, [0, 600], [0, -120]);
    const splitRight = useTransform(scrollY, [0, 600], [0, 120]);

    return (
        <section className="relative h-screen overflow-hidden">
            {/* Background image with parallax */}
            <motion.div
                style={{ y: imgY }}
                className="absolute inset-0 -top-20"
            >
                <img
                    src={HERO_IMG}
                    alt="Premium Otoro nigiri sushi on dark ceramic plate"
                    className="w-full h-[120%] object-cover"
                />
                <div className="absolute inset-0 bg-foreground/30" />
            </motion.div>

            {/* Split text */}
            <motion.div
                style={{ opacity: textOpacity }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
            >
                <div className="flex items-center overflow-hidden">
                    <motion.span
                        style={{ x: splitLeft }}
                        className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light tracking-[0.3em] text-background"
                    >
                        TSU
                    </motion.span>
                    <motion.span
                        style={{ x: splitRight }}
                        className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light tracking-[0.3em] text-background"
                    >
                        RU
                    </motion.span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-6 flex flex-col items-center gap-3"
                >
                    <p className="font-body text-xs sm:text-sm tracking-[0.4em] uppercase text-background/80">
                        The Art of the Cut
                    </p>
                    <p className="font-body text-[10px] tracking-[0.25em] uppercase text-background/50">
                        San Leandro Chamber of Commerce Award Honoree
                    </p>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-12 flex flex-col items-center gap-3"
                >
                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-background/60">
                        Scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="w-px h-8 bg-background/40"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}