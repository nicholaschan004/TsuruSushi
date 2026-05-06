import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { fetchSheet, toDirectImageUrl, preloadImages } from "@/lib/google-sheets";
import { InlineMarkdown } from "@/lib/InlineMarkdown";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAu9nbAJtnbgol4C2LNlNh3HyxJs84W8mfVEtz_r44KzApHlOSFQdzdD_a_5nH7APxsWgu66RWtER/pub?gid=1217918855&single=true&output=csv";

const FALLBACK = [
    { category: "Rolls", name: "E14 Roll", desc: "Shrimp tempura, tobiko, black tobiko, avocado & creamy spicy sauce", image: null },
    { category: "Rolls", name: "Dragon Roll", desc: "Shrimp tempura, and assorted vegetables topped with unagi, avocado, tobiko, wasabi tobiko, and sweet house sauce", image: null },
    { category: "Rolls", name: "Lion King Roll", desc: "Baked salmon over california roll topped tobiko and specialty sauce", image: null },
    { category: "Rolls", name: "Tiger Roll", desc: "(8pcs) Deep fried assorted fish with specialty sauce", image: null },
    { category: "Rolls", name: "Badass Roll", desc: "Shrimp tempura, spicy tuna, topped with tuna, salmon, avocado, tempura crumbs, and sweet house sauce", image: null },
    { category: "Rolls", name: "Rainbow Roll", desc: "(8pcs) Assorted raw fish on top of California roll", image: null },
    { category: "Rolls", name: "Crunchy Roll", desc: "Deep fried shrimp tempura, kani, coated in crispy tempura crumbs, drizzled with sweet house sauce", image: null },
];

export default function MenuCarousel() {
    const scrollRef = useRef(null);
    const sectionRef = useRef(null);
    const hasSnapped = useRef(false);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [items, setItems] = useState(FALLBACK);

    useEffect(() => {
        fetchSheet(SHEET_URL)
            .then((rows) => {
                const parsed = rows.map((r) => ({
                    category: r.category || "Rolls",
                    name: r.name || r.item_name || "",
                    desc: r.description || "",
                    image: toDirectImageUrl(r.image || r.image_url) || null,
                })).filter((item) => item.name);
                if (parsed.length > 0) {
                    preloadImages(parsed.map((item) => item.image).filter(Boolean));
                    setItems(parsed);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!sectionRef.current) return;
        const el = sectionRef.current;
        let lastY = window.scrollY;
        let scrollingDown = false;

        const onScroll = () => {
            scrollingDown = window.scrollY > lastY;
            lastY = window.scrollY;
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasSnapped.current && scrollingDown) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top > -100 && rect.top < 200) {
                        hasSnapped.current = true;
                        window.scrollTo({
                            top: el.offsetTop,
                            behavior: "smooth",
                        });
                    }
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const amount = scrollRef.current.offsetWidth * 0.7;
            scrollRef.current.scrollBy({
                left: direction === "right" ? amount : -amount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section id="menu" ref={sectionRef} className="pt-12 md:pt-16 pb-24 md:pb-36">
            {/* Section header */}
            <div className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6 md:col-start-1">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                                Highlights
                            </p>
                            <div className="flex items-baseline gap-6">
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                                    Most Popular
                                </h2>
                                <Link
                                    to="/menu"
                                    className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                                >
                                    View Full Menu
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                    <div className="col-span-12 md:col-span-3 md:col-start-10 flex items-end justify-start md:justify-end gap-4 mt-6 md:mt-0">
                        <button
                            onClick={() => scroll("left")}
                            className="w-12 h-12 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-12 h-12 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Horizontal scroll carousel */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto hide-scrollbar px-6 md:px-12 pb-4"
            >
                {items.map((item, i) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: i * 0.12 }}
                        className="flex-shrink-0 w-[60vw] sm:w-[45vw] md:w-[28vw] lg:w-[22vw] group cursor-pointer"
                    >
                        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-secondary" />
                            )}
                            {/* Overlay info on hover */}
                            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-500" />
                            <div className="absolute top-6 left-6">
                                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-background/80 bg-foreground/60 px-3 py-1.5 backdrop-blur-sm">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-display text-2xl md:text-3xl font-light text-foreground">
                                <InlineMarkdown text={item.name} />
                            </h3>
                            {item.desc && (
                                <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">
                                    <InlineMarkdown text={item.desc} />
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
