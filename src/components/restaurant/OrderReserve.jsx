import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const CARDS = [
    {
        label: "Reservations",
        heading: "Book a Seat",
        description:
            "Secure your spot at the counter via Resy. We offer two sittings nightly — seats are limited and fill quickly.",
        cta: "Reserve on Resy",
        href: "https://resy.com",
        note: "Powered by Resy",
        accent: false,
    },
    {
        label: "Takeout",
        heading: "Order for Pickup",
        description:
            "Bring Ichigo home. Order our full takeout menu — nigiri, handrolls, and select omakase boxes — via Toast.",
        cta: "Order on Toast",
        href: "https://www.toasttab.com",
        note: "Powered by Toast",
        accent: true,
    },
];

export default function OrderReserve() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="order" ref={ref} className="snap-start min-h-screen flex flex-col justify-center py-16 md:py-24 bg-secondary">
            <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-12 gap-4 mb-16"
                >
                    <div className="col-span-12 md:col-span-6 md:col-start-2">
                        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                            Dine In or Take Out
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight">
                            Order &
                            <br />
                            Reserve
                        </h2>
                    </div>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-12 gap-6">
                    {CARDS.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.15 }}
                            className={`col-span-12 md:col-span-5 ${i === 0 ? "md:col-start-2" : "md:col-start-7"}`}
                        >
                            <div
                                className={`h-full flex flex-col justify-between p-10 md:p-14 border border-border ${card.accent ? "bg-foreground text-background" : "bg-background text-foreground"
                                    }`}
                            >
                                <div>
                                    <p
                                        className={`font-body text-[10px] tracking-[0.4em] uppercase mb-6 ${card.accent ? "text-background/50" : "text-muted-foreground"
                                            }`}
                                    >
                                        {card.label}
                                    </p>
                                    <h3 className="font-display text-3xl md:text-4xl font-light leading-tight">
                                        {card.heading}
                                    </h3>
                                    <p
                                        className={`font-body text-sm mt-6 leading-[1.8] ${card.accent ? "text-background/60" : "text-muted-foreground"
                                            }`}
                                    >
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-12">
                                    <a
                                        href={card.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-3 px-8 py-4 font-body text-xs tracking-[0.3em] uppercase transition-all duration-300 group ${card.accent
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                : "bg-foreground text-background hover:bg-foreground/90"
                                            }`}
                                    >
                                        {card.cta}
                                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </a>
                                    <p
                                        className={`font-body text-[10px] mt-4 tracking-wider ${card.accent ? "text-background/30" : "text-muted-foreground/50"
                                            }`}
                                    >
                                        {card.note}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}