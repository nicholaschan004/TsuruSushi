import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const HOURS = [
    { day: "Monday", lunch: "11:00 AM — 4:00 PM", dinner: "4:00 PM — 9:30 PM" },
    { day: "Tuesday", lunch: "11:00 AM — 4:00 PM", dinner: "4:00 PM — 9:30 PM" },
    { day: "Wednesday", lunch: "11:00 AM — 4:00 PM", dinner: "4:00 PM — 9:30 PM" },
    { day: "Thursday", lunch: "11:00 AM — 4:00 PM", dinner: "4:00 PM — 9:30 PM" },
    { day: "Friday", lunch: "11:00 AM — 4:00 PM", dinner: "4:00 PM — 9:30 PM" },
    { day: "Saturday", lunch: "11:00 AM — 4:00 PM", dinner: "4:00 PM — 9:30 PM" },
    { day: "Sunday", lunch: null, dinner: "12:00 PM — 9:30 PM" },
];

const TODAY = new Date().toLocaleDateString("en-US", { weekday: "long" });

const POSITION = [37.7249, -122.1561]; // 1427 E 14th St, San Leandro, CA

export default function MapHours() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="hours" ref={ref} className="min-h-screen flex flex-col justify-center py-16 md:py-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-12 gap-6 md:gap-10">

                {/* Hours */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-4 md:col-start-2"
                >
                    <p className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
                        Hours of Service
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight mb-10">
                        When to
                        <br />
                        Visit
                    </h2>

                    <div className="space-y-0">
                        {HOURS.map((row, i) => {
                            const isToday = row.day === TODAY;
                            return (
                                <motion.div
                                    key={row.day}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                                    className="py-4 border-b border-border"
                                >
                                    <div className="flex items-center gap-3 mb-1.5">
                                        {isToday && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        )}
                                        <span className={`font-display text-lg font-light ${isToday ? "text-foreground" : "text-muted-foreground"}`}>
                                            {row.day}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-0.5 pl-4 md:pl-5">
                                        {row.lunch && (
                                            <div className="flex items-baseline justify-between">
                                                <span className={`font-body text-[10px] tracking-[0.2em] uppercase ${isToday ? "text-muted-foreground" : "text-muted-foreground/60"}`}>Lunch</span>
                                                <span className={`font-body text-xs ${isToday ? "text-primary" : "text-muted-foreground"}`}>{row.lunch}</span>
                                            </div>
                                        )}
                                        <div className="flex items-baseline justify-between">
                                            <span className={`font-body text-[10px] tracking-[0.2em] uppercase ${isToday ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                                                {row.lunch ? "Dinner" : "Open"}
                                            </span>
                                            <span className={`font-body text-xs ${isToday ? "text-primary" : "text-muted-foreground"}`}>{row.dinner}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.9 }}
                        className="font-body text-xs text-muted-foreground mt-6 leading-relaxed"
                    >
                        Reservations strongly recommended.
                        <br />
                        Walk-ins subject to availability.
                    </motion.p>
                </motion.div>

                {/* Map */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="col-span-12 md:col-span-6 md:col-start-7"
                >
                    <div className="relative overflow-hidden" style={{ height: "520px" }}>
                        <MapContainer
                            center={POSITION}
                            zoom={15}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                            className="z-0"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />
                            <Marker position={POSITION} icon={markerIcon}>
                                <Popup>
                                    <div className="font-body text-xs">
                                        <strong className="font-display text-sm">TSURU</strong>
                                        <br />
                                        1427 E 14th St
                                        <br />
                                        San Leandro, CA 94577
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* Address bar beneath map */}
                    <div className="mt-6 py-4 border-t border-b border-border space-y-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-display text-lg font-light text-foreground">
                                    1427 E 14th St
                                </p>
                                <p className="font-body text-xs text-muted-foreground mt-0.5">
                                    San Leandro, CA 94577
                                </p>
                                <a href="tel:5103523748" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 mt-1 block">
                                    (510) 352-3748
                                </a>
                            </div>
                            <a
                                href="https://maps.google.com/?q=1427+E+14th+St+San+Leandro+CA+94577"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-body text-[10px] tracking-[0.25em] uppercase text-foreground border-b border-foreground pb-0.5 hover:text-primary hover:border-primary transition-colors duration-300"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}