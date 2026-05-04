import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Navigation from "@/components/restaurant/Navigation";
import { InlineMarkdown } from "@/lib/InlineMarkdown";
import Footer from "@/components/restaurant/Footer";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAu9nbAJtnbgol4C2LNlNh3HyxJs84W8mfVEtz_r44KzApHlOSFQdzdD_a_5nH7APxsWgu66RWtER/pub?gid=1692601176&single=true&output=csv";

function parseCSV(text) {
    const rows = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            if (inQuotes && text[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === "," && !inQuotes) {
            rows.push(current);
            current = "";
        } else if (ch === "\n" && !inQuotes) {
            rows.push(current);
            current = "";
            rows.push(null); // row separator
        } else if (ch !== "\r") {
            current += ch;
        }
    }
    if (current) rows.push(current);

    const result = [];
    let row = [];
    for (const cell of rows) {
        if (cell === null) {
            if (row.length > 0) result.push(row);
            row = [];
        } else {
            row.push(cell);
        }
    }
    if (row.length > 0) result.push(row);
    return result;
}

function parseMenuData(csvText) {
    const rows = parseCSV(csvText);
    const headers = rows[0];
    const data = rows.slice(1);

    const categoryIdx = headers.indexOf("Category");
    const sectionIdx = headers.indexOf("Section");
    const nameIdx = headers.indexOf("Item Name");
    const priceIdx = headers.indexOf("Price");
    const descIdx = headers.indexOf("Description");
    const availIdx = headers.indexOf("Available");
    const sortIdx = headers.indexOf("Sort Order");

    const items = data
        .map((row) => ({
            category: row[categoryIdx] || "",
            section: row[sectionIdx] || "",
            name: row[nameIdx] || "",
            price: row[priceIdx] || "",
            description: row[descIdx] || "",
            available: row[availIdx] !== "FALSE",
            sort: parseInt(row[sortIdx]) || 0,
        }))
        .filter((item) => item.available && item.name);

    // Get unique categories in order of appearance
    const categories = [];
    const seen = new Set();
    for (const item of items) {
        if (!seen.has(item.category)) {
            seen.add(item.category);
            categories.push(item.category);
        }
    }

    // Group by category -> section -> items
    const grouped = {};
    for (const item of items) {
        if (!grouped[item.category]) grouped[item.category] = {};
        if (!grouped[item.category][item.section]) grouped[item.category][item.section] = [];
        grouped[item.category][item.section].push(item);
    }

    // Sort items within each section
    for (const cat of Object.values(grouped)) {
        for (const section of Object.keys(cat)) {
            cat[section].sort((a, b) => a.sort - b.sort);
        }
    }

    return { categories, grouped, items };
}

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState("All");
    const cached = sessionStorage.getItem("tsuru_menu");
    const [menuData, setMenuData] = useState(() => cached ? JSON.parse(cached) : null);
    const [loading, setLoading] = useState(!cached);
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetch(SHEET_URL)
            .then((res) => res.text())
            .then((csv) => {
                const data = parseMenuData(csv);
                setMenuData(data);
                setLoading(false);
                sessionStorage.setItem("tsuru_menu", JSON.stringify(data));
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = menuData ? ["All", ...menuData.categories] : ["All"];

    return (
        <div className="min-h-screen bg-background">
            <Navigation forceScrolled />

            {/* Hero */}
            <section ref={heroRef} className="pt-20 md:pt-24 pb-4 md:pb-6 px-6 md:px-12">
                <div className="max-w-screen-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-[0.08em]">
                            The Menu
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Category filter */}
            <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
                <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-4">
                    <div className="flex gap-6 md:gap-10 overflow-x-auto hide-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); window.scrollTo({ top: 0 }); }}
                                className={`font-body text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 pb-1 ${
                                    activeCategory === cat
                                        ? "text-foreground border-b border-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu grid */}
            {loading ? (
                <section className="py-8 md:py-12 px-6 md:px-12">
                    <div className="max-w-screen-2xl mx-auto flex justify-center py-20">
                        <p className="font-body text-sm text-muted-foreground tracking-[0.2em] uppercase">Loading menu...</p>
                    </div>
                </section>
            ) : !menuData ? (
                <section className="py-8 md:py-12 px-6 md:px-12">
                    <div className="max-w-screen-2xl mx-auto flex justify-center py-20">
                        <p className="font-body text-sm text-muted-foreground">Unable to load menu. Please try again later.</p>
                    </div>
                </section>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeCategory === "All" ? (
                            menuData.categories.map((category, idx) => {
                                const sections = menuData.grouped[category];
                                if (!sections) return null;
                                return (
                                    <section key={category} className={`py-10 md:py-14 px-6 md:px-12 ${idx % 2 === 0 ? "bg-background" : "bg-secondary"}`}>
                                        <div className="max-w-screen-2xl mx-auto">
                                            <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-6">
                                                {category}
                                            </h2>
                                            {Object.entries(sections).map(([sectionName, items]) => (
                                                <MenuSection key={sectionName} name={sectionName} categoryName={category} items={items} />
                                            ))}
                                        </div>
                                    </section>
                                );
                            })
                        ) : (
                            <section className="py-10 md:py-14 px-6 md:px-12">
                                <div className="max-w-screen-2xl mx-auto">
                                    {(() => {
                                        const sections = menuData.grouped[activeCategory];
                                        if (!sections) return null;
                                        return Object.entries(sections).map(([sectionName, items]) => (
                                            <MenuSection key={sectionName} name={sectionName} categoryName={activeCategory} items={items} />
                                        ));
                                    })()}
                                </div>
                            </section>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            <Footer />
        </div>
    );
}

function MenuSection({ name, categoryName, items }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const showSubheading = name !== categoryName;

    // Check if this is an "Options" section (like Bento Box options or Combination Dinner options)
    const isOptions = name.includes("Options");

    return (
        <div ref={ref} className="mb-8 last:mb-0">
            {showSubheading && (
                <motion.h3
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="font-display text-lg md:text-xl font-light text-foreground mb-4"
                >
                    {name}
                </motion.h3>
            )}
            <div className={isOptions ? "grid grid-cols-1 gap-y-0" : "grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0"}>
                {items.map((item, i) => (
                    <MenuItem key={`${item.name}-${i}`} item={item} index={i} inView={isInView} isOption={isOptions} />
                ))}
            </div>
        </div>
    );
}

function MenuItem({ item, index, inView, isOption }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.3) }}
            className="py-3 border-b border-border"
        >
            <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-lg font-light text-foreground">
                    <InlineMarkdown text={item.name} />
                </h3>
                {item.price && (
                    <span className="font-display text-base font-light text-foreground flex-shrink-0">
                        {item.price === "Market" ? "Market" : item.price.includes("/") ? item.price : `$${item.price}`}
                    </span>
                )}
            </div>
            {item.description && (
                <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                    <InlineMarkdown text={item.description} />
                </p>
            )}
        </motion.div>
    );
}
