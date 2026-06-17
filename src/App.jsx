import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PageNotFound from './lib/PageNotFound'
import Home from './pages/Home'
import Menu from './pages/Menu'

function App() {
    return (
        <QueryClientProvider client={queryClientInstance}>
            <MotionConfig reducedMotion="user">
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Router>
                <Toaster />
            </MotionConfig>
        </QueryClientProvider>
    )
}

export default App
