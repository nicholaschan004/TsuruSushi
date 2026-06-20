import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fetchSheet } from "@/lib/google-sheets";

const FALLBACK_EMAIL = "Suntsuru1@gmail.com";
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAu9nbAJtnbgol4C2LNlNh3HyxJs84W8mfVEtz_r44KzApHlOSFQdzdD_a_5nH7APxsWgu66RWtER/pub?gid=187713365&single=true&output=csv";

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [email, setEmail] = useState(FALLBACK_EMAIL);

    useEffect(() => {
        fetchSheet(SHEET_URL)
            .then((rows) => {
                if (rows.length > 0) {
                    const row = rows[0];
                    const value = row.email || row.value || Object.values(row)[0];
                    if (value && value.includes("@")) setEmail(value);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <footer id="contact" ref={ref} className="snap-start py-8 px-6 md:px-12 bg-background relative">
            {/* Blade edge top line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-border" />

            {/* Bottom info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="max-w-screen-2xl mx-auto"
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <span className="font-display text-sm tracking-[0.2em] text-foreground">
                            TSURU SUSHI
                        </span>
                        <span className="h-px w-8 bg-border hidden md:block" />
                        <span className="font-body text-xs text-muted-foreground">
                            1427 E 14th St, San Leandro, CA 94577
                        </span>
                    </div>

                    <div className="flex items-center gap-5 md:gap-8">
                        <a href="https://www.instagram.com/tsuru.sushi/" target="_blank" rel="noopener noreferrer" className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300">
                            Instagram<span className="sr-only"> (opens in new tab)</span>
                        </a>
                        <a href="https://www.facebook.com/TsuruSushi.CA/" target="_blank" rel="noopener noreferrer" className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300">
                            Facebook<span className="sr-only"> (opens in new tab)</span>
                        </a>
                        <a href="tel:5103523748" className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300">
                            Contact
                        </a>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border text-center space-y-3">
                    <p className="font-body text-xs text-muted-foreground">
                        For catering orders & further inquiries email: <a href={`mailto:${email}`} className="text-foreground underline underline-offset-2 hover:text-primary transition-colors duration-300">{email}</a>
                    </p>
                    <p className="font-body text-[10px] text-muted-foreground tracking-wider">
                        © 2026 Tsuru Sushi. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </footer>
    );
}