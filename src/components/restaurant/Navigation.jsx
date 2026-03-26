import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Menu", href: "#menu" },
    { label: "Experience", href: "#experience" },
    { label: "Provenance", href: "#provenance" },
    { label: "Reserve", href: "#reserve" },
];

export default function Navigation() {
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 100);
            if (currentY < lastScrollY || currentY < 100) {
                setVisible(true);
            } else {
                setVisible(false);
            }
            setLastScrollY(currentY);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const scrollTo = (href) => {
        setMobileOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <AnimatePresence>
                {visible && (
                    <motion.header
                        initial={{ y: -80 }}
                        animate={{ y: 0 }}
                        exit={{ y: -80 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${scrolled ? "bg-background/90 backdrop-blur-md" : "bg-transparent"
                            }`}
                    >
                        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 md:px-12 py-5">
                            <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-display text-2xl tracking-[0.3em] font-light text-foreground">
                                TSURU
                            </a>

                            <nav className="hidden md:flex items-center gap-10">
                                {NAV_LINKS.map((link) => (
                                    <button
                                        key={link.label}
                                        onClick={() => scrollTo(link.href)}
                                        className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                                    >
                                        {link.label}
                                    </button>
                                ))}
                            </nav>

                            <button
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden text-foreground"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Blade edge line */}
                        {scrolled && (
                            <div className="h-px bg-border" />
                        )}
                    </motion.header>
                )}
            </AnimatePresence>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="absolute top-6 right-6 text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col items-center gap-8">
                            {NAV_LINKS.map((link, i) => (
                                <motion.button
                                    key={link.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => scrollTo(link.href)}
                                    className="font-display text-3xl font-light tracking-[0.2em] text-foreground"
                                >
                                    {link.label}
                                </motion.button>

                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}