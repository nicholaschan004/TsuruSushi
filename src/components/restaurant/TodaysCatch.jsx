import React from "react";
import { motion } from "framer-motion";

const catches = [
    { name: "Otoro", origin: "Tsukiji Market, Tokyo", note: "Bluefin belly, A5 grade" },
    { name: "Uni", origin: "Hokkaido, Japan", note: "Murasaki sea urchin, wild caught" },
    { name: "Kinmedai", origin: "Suruga Bay", note: "Golden eye snapper, aged 3 days" },
];

export default function TodaysCatch() {
    return (
        <section className="snap-start min-h-screen flex flex-col justify-center pt-16 pb-8 md:pt-24 md:pb-12 px-6 md:px-12 max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4 md:col-start-2">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                            Today's Selection
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-foreground">
                            The Morning
                            <br />
                            Catch
                        </h2>
                    </motion.div>
                </div>

                <div className="col-span-12 md:col-span-5 md:col-start-7 mt-12 md:mt-8">
                    <div className="space-y-0">
                        {catches.map((item, i) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                className="py-6 border-b border-border"
                            >
                                <div className="flex items-baseline justify-between">
                                    <h3 className="font-display text-2xl md:text-3xl font-light text-foreground">
                                        {item.name}
                                    </h3>
                                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                                        {item.origin}
                                    </span>
                                </div>
                                <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed">
                                    {item.note}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}