import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { TOAST_ORDER_URL } from "@/lib/order-links";

const NAV_LINKS = [
    { label: "Menu", href: "/menu" },
    { label: "Chef's Special", href: "#experience" },
    { label: "Most Popular", href: "#menu" },
    { label: "About", href: "#about" },
    { label: "Hours", href: "#hours" },
    { label: "Directions", href: "https://maps.google.com/?q=1427+E+14th+St+San+Leandro+CA+94577", mobileOnly: true },
];

export default function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuButtonRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
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

    useEffect(() => {
        if (!mobileOpen) return;

        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusCloseButton = window.requestAnimationFrame(() => {
            closeButtonRef.current?.focus();
        });

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setMobileOpen(false);
                return;
            }

            if (event.key !== "Tab" || !mobileMenuRef.current) return;
            const focusable = mobileMenuRef.current.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            window.cancelAnimationFrame(focusCloseButton);
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
        };
    }, [mobileOpen]);

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
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:px-4 focus:py-3 focus:font-body focus:text-sm focus:text-foreground"
            >
                Skip to main content
            </a>
            <AnimatePresence>
                {visible && (
                    <motion.header
                        initial={{ y: -80 }}
                        animate={{ y: 0 }}
                        exit={{ y: -80 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md"
                    >
                        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 md:px-12 py-5">
                            <a href="/" onClick={(e) => { e.preventDefault(); if (location.pathname !== "/") { navigate("/"); } else { window.scrollTo({ top: 0, behavior: "smooth" }); } }} className="flex items-center gap-3 text-foreground">
                                <img src="/tsurufavicon.png" alt="" className="w-8 h-8 object-contain" />
                                <div className="flex flex-col">
                                    <span className="font-display text-base sm:text-xl tracking-[0.3em] font-light leading-tight">TSURU SUSHI</span>
                                    <span className="font-body text-[7px] sm:text-[8px] tracking-[0.3em] uppercase opacity-60 leading-tight">Japanese Restaurant</span>
                                    <span className="font-body text-[7px] sm:text-[8px] tracking-[0.3em] uppercase opacity-60 leading-tight">Sushi Bar & Grill</span>
                                </div>
                                <span className="sr-only"> — Home</span>
                            </a>

                            <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
                                {NAV_LINKS.filter(l => !l.mobileOnly).map((link) => (
                                    <button
                                        key={link.label}
                                        onClick={() => scrollTo(link.href)}
                                        className="font-body text-[11px] xl:text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 text-foreground/70 hover:text-foreground"
                                    >
                                        {link.label}
                                    </button>
                                ))}
                                <a
                                    href={TOAST_ORDER_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 whitespace-nowrap font-body text-[11px] tracking-[0.18em] uppercase text-foreground/70 transition-colors duration-300 hover:text-foreground xl:text-xs"
                                >
                                    Order Online
                                    <span className="sr-only"> through Toast (opens in new tab)</span>
                                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                                </a>
                            </nav>

                            <button
                                ref={menuButtonRef}
                                onClick={() => setMobileOpen(true)}
                                aria-label="Open menu"
                                aria-expanded={mobileOpen}
                                aria-controls="mobile-navigation"
                                className="lg:hidden text-foreground"
                            >
                                <Menu className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Blade edge line */}
                        <div className="h-px bg-border" />
                    </motion.header>
                )}
            </AnimatePresence>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        id="mobile-navigation"
                        ref={mobileMenuRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site navigation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center"
                    >
                        <button
                            ref={closeButtonRef}
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
                            <motion.a
                                href={TOAST_ORDER_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: NAV_LINKS.length * 0.1 }}
                                className="inline-flex items-center gap-2 font-display text-2xl font-light tracking-[0.2em] text-foreground"
                            >
                                Order Online
                                <span className="sr-only"> through Toast (opens in new tab)</span>
                                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
}
