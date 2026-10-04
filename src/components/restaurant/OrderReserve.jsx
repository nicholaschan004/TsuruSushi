import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { TOAST_ORDER_URL } from "@/lib/order-links";

const CARDS = [
    {
        label: "Direct Online Ordering",
        heading: "Order with Toast",
        description:
            "Order pickup or delivery through Tsuru Sushi's new online ordering experience.",
        cta: "Start Your Order",
        href: TOAST_ORDER_URL,
        note: "Powered by Toast",
        featured: true,
        external: true,
    },
    {
        label: "Phone Ordering",
        heading: "Call for Pickup",
        description:
            "Call us to place your pickup order directly with the restaurant.",
        cta: "(510) 352-3748",
        href: "tel:5103523748",
        note: "Pickup orders",
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
                    <div className="col-span-12 md:col-span-8">
                        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                            Pickup &amp; Delivery
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight">
                            Order Online or
                            <br />
                            Give Us a Call
                        </h2>
                    </div>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {CARDS.map((card, i) => (
                        <motion.div
                            key={card.heading}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.15 }}
                        >
                            <div
                                className={`h-full flex flex-col justify-between gap-8 p-8 md:p-10 border border-border ${card.featured ? "bg-foreground text-background" : "bg-background text-foreground"
                                    }`}
                            >
                                <div>
                                    <p
                                        className={`font-body text-[10px] tracking-[0.4em] uppercase mb-6 ${card.featured ? "text-background/60" : "text-muted-foreground"
                                            }`}
                                    >
                                        {card.label}
                                    </p>
                                    <h3 className="font-display text-2xl md:text-3xl font-light leading-tight">
                                        {card.heading}
                                    </h3>
                                    <p
                                        className={`font-body text-sm mt-6 leading-[1.8] ${card.featured ? "text-background/70" : "text-muted-foreground"
                                            }`}
                                    >
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <a
                                        href={card.href}
                                        target={card.external ? "_blank" : undefined}
                                        rel={card.external ? "noopener noreferrer" : undefined}
                                        className={`inline-flex items-center gap-2 px-5 py-3 md:px-6 md:py-3 font-body text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 group ${card.featured
                                                ? "bg-[#63b9aa] text-foreground hover:bg-[#4fa494]"
                                                : "bg-foreground text-background hover:bg-foreground/90"
                                            }`}
                                    >
                                        {card.cta}
                                        {card.external && <span className="sr-only"> (opens in new tab)</span>}
                                        {card.external ? (
                                            <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        ) : (
                                            <Phone aria-hidden="true" className="h-3.5 w-3.5" />
                                        )}
                                    </a>
                                    <p
                                        className={`font-body text-[10px] mt-4 tracking-wider ${card.featured ? "text-background/60" : "text-muted-foreground"
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
