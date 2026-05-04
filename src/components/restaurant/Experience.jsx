import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fetchSheet } from "@/lib/google-sheets";
import { InlineMarkdown } from "@/lib/InlineMarkdown";


const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAu9nbAJtnbgol4C2LNlNh3HyxJs84W8mfVEtz_r44KzApHlOSFQdzdD_a_5nH7APxsWgu66RWtER/pub?gid=1668082783&single=true&output=csv";

const FALLBACK = [
    { name: "Aburi Salmon", price: "$8.50", desc: "(2pcs) Seared salmon nigiri glazed over house sauce" },
    { name: "Wagyu Nigiri", price: "$17.95", desc: "(2pcs) Seared A5 wagyu beef glazed over house sauce, topped with ginger and green onion" },
    { name: "Hamachi Kama", price: "$25.95", desc: "Grilled yellowtail fish collar" },
    { name: "Uni (Japan)", price: "$25.95", desc: "Sea urchin" },
    { name: "Uni (Santa Barbara)", price: "$15.95", desc: "Sea urchin" },
    { name: "Blue Shrimp", price: "MKT Price" },
    { name: "Blue Fin Tuna", price: "$8.95" },
    { name: "Otoro", desc: "Premium bluefin tuna belly" },
    { name: "Sake Toro", desc: "Premium cut salmon belly" },
    { name: "Ikamaruyaki", desc: "Grilled squid" },
    { name: "Aji", price: "Tataki $MKT | Sushi $10.50" },
];

export default function Experience() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [specials, setSpecials] = useState(FALLBACK);

    useEffect(() => {
        fetchSheet(SHEET_URL)
            .then((rows) => {
                const items = rows.map((r) => ({
                    name: r.name || r.item_name || "",
                    price: r.price || "",
                    desc: r.description || "",
                })).filter((item) => item.name);
                if (items.length > 0) setSpecials(items);
            })
            .catch(() => {});
    }, []);

    return (
        <section id="experience" ref={ref} className="snap-start py-16 md:py-24 bg-secondary">
            <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
                {/* Top row: image + heading */}
                <div className="grid grid-cols-12 gap-6 md:gap-10 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="col-span-12 md:col-span-5"
                    >
                        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                            Premium Selection
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
                            Chef's
                            <br />
                            Special
                        </h2>
                        <p className="font-body text-sm text-muted-foreground mt-6 leading-[1.8]">
                            Discover our curated selection of premium nigiri and seasonal specialties.
                        </p>
                    </motion.div>


                </div>

                {/* Two-column specials grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0"
                >
                    {specials.map((item) => (
                        <div key={item.name} className="flex flex-col py-3 border-b border-border">
                            <div className="flex items-baseline justify-between w-full">
                                <span className="font-display text-lg font-light">{item.name}</span>
                                {item.price && (
                                    <span className="font-body text-sm text-muted-foreground ml-4 whitespace-nowrap">{item.price}</span>
                                )}
                            </div>
                            {item.desc && (
                                <p className="font-body text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                                    <InlineMarkdown text={item.desc} />
                                </p>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
