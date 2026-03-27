import Navigation from "@/components/restaurant/Navigation"
import Hero from "@/components/restaurant/Hero"
import MenuCarousel from "@/components/restaurant/Menucarousel"
import Experience from "@/components/restaurant/Experience"
import Provenance from "@/components/restaurant/Provenance"
import TodaysCatch from "@/components/restaurant/TodaysCatch"
import Booking from "@/components/restaurant/Booking"
import OrderReserve from "@/components/restaurant/OrderReserve"
import MapHours from "@/components/restaurant/MapHours"
import Footer from "@/components/restaurant/Footer"

export default function Home() {
    return (
        <div className="h-screen overflow-y-auto snap-y snap-proximity bg-background">
            <Navigation />
            <Hero />
            <Experience />
            <TodaysCatch />
            <MenuCarousel />
            <Provenance />
            <OrderReserve />
            <MapHours />
            <Footer />
        </div>
    )
}
