import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const MENU_ITEMS = [
    {
        category: "Nigiri",
        name: "Sake",
        description: "Wild King Salmon, aged 24 hours. Torched with house-made tare.",
        price: "8",
        image: "https://media.base44.com/images/public/69c4afc75d0284fc64e49e47/b34b4c852_generated_e7f8a81c.png",
        alt: "Three pieces of fresh salmon nigiri on black slate plate"
    },
    {
        category: "Rolls",
        name: "Rainbow Roll",
        description: "California roll base topped with rotating slices of fresh tuna, salmon, yellowtail and avocado.",
        price: "19.14",
        image: "https://media.base44.com/images/public/69c4afc75d0284fc64e49e47/4b7e0c0be_generated_image.png",
        alt: "Rainbow sushi roll topped with colorful fish and avocado"
    },
    {
        category: "Nigiri",
        name: "Maguro",
        description: "Lean bluefin tuna. Clean, mineral finish with a whisper of wasabi.",
        price: "14",
        image: "https://media.base44.com/images/public/69c4afc75d0284fc64e49e47/bfd98dfab_generated_f9891c09.png",
        alt: "Single piece of deep red bluefin tuna sushi on ceramic plate"
    },
    {
        category: "Handrolls",
        name: "Negitoro",
        description: "Minced fatty tuna with scallion, wrapped in crisp Ariake nori.",
        price: "12",
        image: "https://media.base44.com/images/public/69c4afc75d0284fc64e49e47/4361a71e6_generated_97b3ba6e.png",
        alt: "Crispy nori hand roll filled with fresh fish and rice"
    },
    {
        category: "Nigiri",
        name: "Uni",
        description: "Hokkaido Murasaki. Briny, sweet, with a custard-like finish.",
        price: "18",
        image: "https://media.base44.com/images/public/69c4afc75d0284fc64e49e47/bce10d114_generated_fd901bd3.png",
        alt: "Golden sea urchin uni on black ceramic plate"
    },
];

export default function MenuCarousel() {
    const scrollRef = useRef(null);
    const sectionRef = useRef(null);
    const hasSnapped = useRef(false);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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
                                Most Popular
                            </p>
                            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                                The Menu
                            </h2>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Horizontal scroll carousel */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto hide-scrollbar px-6 md:px-12 pb-4"
            >
                {MENU_ITEMS.map((item, i) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: i * 0.12 }}
                        className="flex-shrink-0 w-[60vw] sm:w-[45vw] md:w-[28vw] lg:w-[22vw] group cursor-pointer"
                    >
                        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
                            <img
                                src={item.image}
                                alt={item.alt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Overlay info on hover */}
                            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-500" />
                            <div className="absolute top-6 left-6">
                                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-background/80 bg-foreground/60 px-3 py-1.5 backdrop-blur-sm">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 flex items-baseline justify-between">
                            <div>
                                <h3 className="font-display text-2xl md:text-3xl font-light text-foreground">
                                    {item.name}
                                </h3>
                                <p className="font-body text-sm text-muted-foreground mt-2 leading-relaxed max-w-xs">
                                    {item.description}
                                </p>
                            </div>
                            <span className="font-display text-2xl font-light text-foreground">
                                ${item.price}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}