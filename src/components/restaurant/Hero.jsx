import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetchSheet, toDirectImageUrl } from "@/lib/google-sheets";
import { resolveImage } from "@/lib/image-resolver";
import { InlineMarkdown } from "@/lib/InlineMarkdown";
import { TOAST_ORDER_URL } from "@/lib/order-links";

const FALLBACK_SUBTITLES = ["— San Leandro Chamber of Commerce Award Honoree —"];
const HERO_ALT_FALLBACK = "Premium Otoro nigiri sushi on dark ceramic plate";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAu9nbAJtnbgol4C2LNlNh3HyxJs84W8mfVEtz_r44KzApHlOSFQdzdD_a_5nH7APxsWgu66RWtER/pub?gid=294905546&single=true&output=csv";

export default function Hero() {
    const { scrollY } = useScroll();
    const imgY = useTransform(scrollY, [0, 800], [0, 200]);
    const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const splitLeft = useTransform(scrollY, [0, 600], [0, -120]);
    const splitRight = useTransform(scrollY, [0, 600], [0, 120]);

    const [heroImg, setHeroImg] = useState("/hero-default.jpg");
    const [heroAlt, setHeroAlt] = useState(HERO_ALT_FALLBACK);
    const [subtitles, setSubtitles] = useState(FALLBACK_SUBTITLES);
    const awardSubtitles = subtitles.filter((subtitle) => /award|honou?ree|chamber of commerce/i.test(subtitle));
    const supportingSubtitles = subtitles.filter((subtitle) => !/award|honou?ree|chamber of commerce/i.test(subtitle));

    useEffect(() => {
        fetchSheet(SHEET_URL)
            .then((rows) => {
                if (rows.length > 0) {
                    const rawUrl = rows[0].image || rows[0].image_url;
                    const img = resolveImage(toDirectImageUrl(rawUrl));
                    if (img) setHeroImg(img);
                    const altText = (rows[0].alt || rows[0].alt_text || "").trim();
                    if (altText) setHeroAlt(altText);
                    const subs = rows
                        .map((r) => r.subtitle || r.tagline)
                        .filter(Boolean);
                    if (subs.length > 0) setSubtitles(subs);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <section className="relative h-screen overflow-hidden bg-foreground">
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
                    alt={heroAlt}
                    className="w-full h-[120%] object-cover"
                />
            </motion.div>

            {/* Split text — the scrim lives on this text container (not just a
                sibling overlay) so the white text has a real ~4.5:1+ backdrop
                over the bright photo, and contrast checkers read it correctly. */}
            <motion.div
                style={{ opacity: textOpacity }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-foreground/65 pt-20"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="mb-4 flex w-full max-w-2xl flex-col items-center gap-1 px-6"
                >
                    {awardSubtitles.map((sub, i) => (
                        <p key={i} className="w-full whitespace-normal break-words text-center font-body text-[9px] uppercase leading-relaxed tracking-[0.16em] text-background/90 sm:text-[10px] sm:tracking-[0.35em]">
                            <InlineMarkdown text={sub} />
                        </p>
                    ))}
                </motion.div>

                <h1 className="flex flex-col items-center overflow-hidden">
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
                </h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="relative mt-4 flex flex-col items-center gap-1.5"
                >
                    {supportingSubtitles.map((sub, i) => (
                        <p key={i} className="px-4 text-center font-body text-[10px] uppercase tracking-[0.25em] text-background/85 sm:tracking-[0.3em]">
                            <InlineMarkdown text={sub} />
                        </p>
                    ))}
                    <a
                        href={TOAST_ORDER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex min-w-52 items-center justify-center gap-2 border border-[#63b9aa] bg-[#63b9aa] px-6 py-3.5 font-body text-[10px] tracking-[0.2em] uppercase text-foreground transition-colors duration-300 hover:border-[#4fa494] hover:bg-[#4fa494]"
                    >
                        Order Pickup &amp; Delivery
                        <span className="sr-only"> through Toast (opens in new tab)</span>
                        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="absolute left-1/2 top-full mt-10 -translate-x-1/2"
                        aria-hidden="true"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            className="h-8 w-px bg-background/40"
                        />
                    </motion.div>
                </motion.div>

            </motion.div>
        </section>
    );
}
