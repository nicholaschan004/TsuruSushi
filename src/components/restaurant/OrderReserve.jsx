import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const CARDS = [
    {
        label: "Delivery & Pickup",
        heading: "Order on DoorDash",
        description:
            "Get Tsuru delivered to your door or pick it up fresh — nigiri, rolls, and more available on DoorDash.",
        cta: "Order on DoorDash",
        href: "https://www.doordash.com/store/tsuru-sushi-san-leandro-78059/2312584/?pickup=true&utm_campaign=gpa",
        note: "Powered by DoorDash",
        accent: false,
    },
    {
        label: "Delivery & Pickup",
        heading: "Order on Grubhub",
        description:
            "Order our full menu for delivery or pickup through Grubhub — fresh sushi straight from our kitchen to you.",
        cta: "Order on Grubhub",
        href: "https://www.grubhub.com/restaurant/tsuru-sushi-japanese-restaurant-1427-e-14th-st-san-leandro/4073528",
        note: "Powered by Grubhub",
        accent: true,
    },
    {
        label: "Delivery & Pickup",
        heading: "Order on Uber Eats",
        description:
            "Craving sushi? Order Tsuru for delivery or pickup through Uber Eats — quick, easy, and always fresh.",
        cta: "Order on Uber Eats",
        href: "https://www.ubereats.com/store/tsuru-sushi-japanese-restaurant/mwIEYF8XWNCkri-zaJby1Q?diningMode=PICKUP",
        note: "Powered by Uber Eats",
        accent: false,
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
                            Pickup
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight">
                            Phone-In to pick up
                            <br />
                            at our restaurant
                        </h2>
                        <a href="tel:5103523748" className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-primary hover:text-primary/80 transition-colors duration-300 mt-2 block">
                            (510) 352-3748
                        </a>
                        <p className="font-body text-xs text-muted-foreground mt-6 tracking-[0.15em] uppercase">
                            Order through online platforms below for delivery
                        </p>
                    </div>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CARDS.map((card, i) => (
                        <motion.div
                            key={card.heading}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.15 }}
                        >
                            <div
                                className={`h-full flex flex-col justify-between p-8 md:p-10 border border-border ${card.accent ? "bg-foreground text-background" : "bg-background text-foreground"
                                    }`}
                            >
                                <div>
                                    <p
                                        className={`font-body text-[10px] tracking-[0.4em] uppercase mb-6 ${card.accent ? "text-background/50" : "text-muted-foreground"
                                            }`}
                                    >
                                        {card.label}
                                    </p>
                                    <h3 className="font-display text-2xl md:text-3xl font-light leading-tight">
                                        {card.heading}
                                    </h3>
                                    <p
                                        className={`font-body text-sm mt-6 leading-[1.8] ${card.accent ? "text-background/60" : "text-muted-foreground"
                                            }`}
                                    >
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <a
                                        href={card.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-2 px-5 py-3 md:px-6 md:py-3 font-body text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-300 group ${card.accent
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                : "bg-foreground text-background hover:bg-foreground/90"
                                            }`}
                                    >
                                        {card.cta}
                                        <span className="sr-only"> (opens in new tab)</span>
                                        <ArrowUpRight aria-hidden="true" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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