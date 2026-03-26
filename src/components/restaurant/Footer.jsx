import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <footer ref={ref} className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 bg-background relative">
            {/* Blade edge top line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-border" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1 }}
                className="text-center max-w-2xl"
            >
                <p className="font-body text-[10px] tracking-[0.5em] uppercase text-muted-foreground mb-8">
                    End of Service
                </p>

                <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-foreground leading-none">
                    Join the
                    <br />
                    Counter
                </h2>

                <div className="mt-10 inline-flex items-center gap-3 px-5 py-3 border border-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                        San Leandro Chamber of Commerce Award Honoree
                    </span>
                </div>

                <p className="font-body text-sm text-muted-foreground mt-8 leading-[1.8]">
                    12 seats. Two sittings. One pursuit of perfection.
                </p>

                <motion.a
                    href="#reserve"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    onClick={(e) => {
                        e.preventDefault();
                        document.querySelector("#reserve")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-block mt-10 px-10 py-4 bg-primary text-primary-foreground font-body text-xs tracking-[0.3em] uppercase hover:bg-primary/90 transition-colors duration-300"
                >
                    Reserve a Seat
                </motion.a>
            </motion.div>

            {/* Bottom info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-0 left-0 right-0 px-6 md:px-12 py-8"
            >
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <span className="font-display text-sm tracking-[0.2em] text-foreground">
                            TSURU
                        </span>
                        <span className="h-px w-8 bg-border hidden md:block" />
                        <span className="font-body text-xs text-muted-foreground">
                            1427 E 14th St, San Leandro, CA 94577
                        </span>
                    </div>

                    <div className="flex items-center gap-8">
                        <a href="#" className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300">
                            Instagram
                        </a>
                        <a href="#" className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300">
                            Twitter
                        </a>
                        <a href="#" className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300">
                            Contact
                        </a>
                    </div>
                </div>

                <div className="max-w-screen-2xl mx-auto mt-6 pt-6 border-t border-border">
                    <p className="font-body text-[10px] text-muted-foreground text-center tracking-wider">
                        © 2026 Tsuru. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </footer>
    );
}