import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const CHEF_IMG = "https://media.base44.com/images/public/69c4afc75d0284fc64e49e47/d665309f3_generated_f3f56c15.png";

const SITTINGS = [
    { time: "6:00 PM", label: "First Seating", seats: 4 },
    { time: "6:30 PM", label: "First Seating", seats: 2 },
    { time: "8:00 PM", label: "Second Seating", seats: 6 },
    { time: "8:30 PM", label: "Second Seating", seats: 3 },
    { time: "9:00 PM", label: "Late Seating", seats: 1 },
];

export default function Booking() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [selected, setSelected] = useState(null);

    return (
        <section id="reserve" ref={ref} className="snap-start min-h-screen flex flex-col justify-center py-16 md:py-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-12 gap-6 md:gap-10">
                {/* Sittings */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-5 md:col-start-2 order-2 md:order-1"
                >
                    <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                        The Counter Ritual
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight mb-10">
                        Reserve
                        <br />
                        a Seat
                    </h2>

                    <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
                        Tonight's Available Sittings
                    </p>

                    <div className="space-y-0">
                        {SITTINGS.map((sitting, i) => (
                            <motion.button
                                key={sitting.time}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                                onClick={() => setSelected(i)}
                                className={`w-full flex items-center justify-between py-5 border-b border-border transition-all duration-300 text-left group ${selected === i ? "bg-foreground/[0.03]" : "hover:bg-foreground/[0.02]"
                                    }`}
                            >
                                <div className="flex items-baseline gap-4">
                                    <span className={`font-display text-2xl font-light transition-colors duration-300 ${selected === i ? "text-primary" : "text-foreground"
                                        }`}>
                                        {sitting.time}
                                    </span>
                                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                                        {sitting.label}
                                    </span>
                                </div>
                                <span className="font-body text-xs text-muted-foreground">
                                    {sitting.seats} {sitting.seats === 1 ? "seat" : "seats"} left
                                </span>
                            </motion.button>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-10"
                    >
                        <Button
                            className={`w-full h-14 font-body text-xs tracking-[0.3em] uppercase transition-all duration-500 ${selected !== null
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary"
                                }`}
                        >
                            {selected !== null ? `Reserve — ${SITTINGS[selected].time}` : "Select a Sitting"}
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Chef image */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 1 }}
                    className="col-span-12 md:col-span-5 md:col-start-8 order-1 md:order-2"
                >
                    <div className="relative overflow-hidden aspect-[4/5] sticky top-24">
                        <img
                            src={CHEF_IMG}
                            alt="Chef's hands using a sharp knife to precision-cut fresh fish"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}