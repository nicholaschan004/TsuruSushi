import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fetchSheet, toDirectImageUrl } from "@/lib/google-sheets";

const FALLBACK_IMG = "https://media.base44.com/images/public/69c4afc75d0284fc64e49e47/6f957d3e2_generated_38c80c72.png";
const FALLBACK_SUBTITLE = "— San Leandro Chamber of Commerce Award Honoree —";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAu9nbAJtnbgol4C2LNlNh3HyxJs84W8mfVEtz_r44KzApHlOSFQdzdD_a_5nH7APxsWgu66RWtER/pub?gid=294905546&single=true&output=csv";

export default function Hero() {
    const { scrollY } = useScroll();
    const imgY = useTransform(scrollY, [0, 800], [0, 200]);
    const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const splitLeft = useTransform(scrollY, [0, 600], [0, -120]);
    const splitRight = useTransform(scrollY, [0, 600], [0, 120]);

    const [heroImg, setHeroImg] = useState(FALLBACK_IMG);
    const [subtitle, setSubtitle] = useState(FALLBACK_SUBTITLE);

    useEffect(() => {
        fetchSheet(SHEET_URL)
            .then((rows) => {
                if (rows.length > 0) {
                    const row = rows[0];
                    const img = toDirectImageUrl(row.image || row.image_url);
                    if (img) setHeroImg(img);
                    const sub = row.subtitle || row.tagline;
                    if (sub) setSubtitle(sub);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <section className="relative h-screen overflow-hidden">
            {/* Background image with parallax + slow zoom */}
            <motion.div
                style={{ y: imgY }}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: "easeOut" }}
                className="absolute inset-0 -top-20"
            >
                <img
                    src={heroImg}
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
                <div className="flex flex-col items-center overflow-hidden">
                    <motion.span
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        style={{ x: splitLeft }}
                        className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light tracking-[0.3em] text-background"
                    >
                        TSURU
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        style={{ x: splitRight }}
                        className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light tracking-[0.3em] text-background"
                    >
                        SUSHI
                    </motion.span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-6 flex flex-col items-center gap-3"
                >
                    <p className="font-body text-[10px] tracking-[0.25em] uppercase text-background/50 text-center px-4">
                        {subtitle}
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
