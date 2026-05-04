import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import Navigation from "@/components/restaurant/Navigation"
import Hero from "@/components/restaurant/Hero"
import MenuCarousel from "@/components/restaurant/Menucarousel"
import Experience from "@/components/restaurant/Experience"
import Provenance from "@/components/restaurant/Provenance"
import OrderReserve from "@/components/restaurant/OrderReserve"
import MapHours from "@/components/restaurant/MapHours"
import Footer from "@/components/restaurant/Footer"

export default function Home() {
    const location = useLocation()
    const isFirstRender = useRef(true)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const target = location.state?.scrollTo || location.hash
        if (!target) return
        if (isFirstRender.current && !location.state?.scrollTo) {
            isFirstRender.current = false
            return
        }
        isFirstRender.current = false
        setTimeout(() => {
            const el = document.querySelector(target)
            if (el) el.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }, [location.state, location.hash])

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <Hero />
            <Experience />
            <MenuCarousel />
            <OrderReserve />
            <Provenance />
            <MapHours />
            <Footer />
        </div>
    )
}
