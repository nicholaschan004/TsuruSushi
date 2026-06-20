import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
    { label: "Menu", href: "/menu" },
    { label: "Chef's Special", href: "#experience" },
    { label: "Most Popular", href: "#menu" },
    { label: "Order Online", href: "#order" },
    { label: "About", href: "#about" },
    { label: "Hours", href: "#hours" },
    { label: "Contact", href: "#contact" },
    { label: "Directions", href: "https://maps.google.com/?q=1427+E+14th+St+San+Leandro+CA+94577", mobileOnly: true },
];

export default function Navigation({ forceScrolled = false }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(forceScrolled);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(forceScrolled || currentY > 100);
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
        if (href.startsWith("http")) {
            window.open(href, "_blank", "noopener,noreferrer");
            return;
        }
        if (href.startsWith("/")) {
            if (location.pathname === href) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                navigate(href);
            }
            return;
        }
        if (location.pathname !== "/") {
            navigate("/", { state: { scrollTo: href } });
            return;
        }
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
                            <a href="/" aria-label="Tsuru Sushi — home" onClick={(e) => { e.preventDefault(); if (location.pathname !== "/") { navigate("/"); } else { window.scrollTo({ top: 0, behavior: "smooth" }); } }} className={`flex items-center gap-3 transition-colors duration-500 ${scrolled ? "text-foreground" : "text-white"}`}>
                                <img src="/tsurufavicon.png" alt="Tsuru logo" className="w-8 h-8 object-contain" />
                                <div className="flex flex-col">
                                    <span className="font-display text-base sm:text-xl tracking-[0.3em] font-light leading-tight">TSURU SUSHI</span>
                                    <span className="font-body text-[7px] sm:text-[8px] tracking-[0.3em] uppercase opacity-60 leading-tight">Japanese Restaurant</span>
                                    <span className="font-body text-[7px] sm:text-[8px] tracking-[0.3em] uppercase opacity-60 leading-tight">Sushi Bar & Grill</span>
                                </div>
                            </a>

                            <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
                                {NAV_LINKS.filter(l => !l.mobileOnly).map((link) => (
                                    <button
                                        key={link.label}
                                        onClick={() => scrollTo(link.href)}
                                        className={`font-body text-[11px] xl:text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 ${scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"}`}
                                    >
                                        {link.label}
                                    </button>
                                ))}
                            </nav>

                            <button
                                onClick={() => setMobileOpen(true)}
                                aria-label="Open menu"
                                className={`lg:hidden transition-colors duration-500 ${scrolled ? "text-foreground" : "text-white"}`}
                            >
                                <Menu className="w-5 h-5" aria-hidden="true" />
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
                            aria-label="Close menu"
                            className="absolute top-6 right-6 text-foreground"
                        >
                            <X className="w-5 h-5" aria-hidden="true" />
                        </button>
                        <div className="flex flex-col items-center gap-6">
                            {NAV_LINKS.map((link, i) => (
                                <motion.button
                                    key={link.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => scrollTo(link.href)}
                                    className="font-display text-2xl font-light tracking-[0.2em] text-foreground"
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