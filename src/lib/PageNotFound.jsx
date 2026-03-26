export default function PageNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="max-w-md w-full text-center space-y-6">
                <h1 className="text-7xl font-light text-muted-foreground font-display">404</h1>
                <div className="h-0.5 w-16 bg-border mx-auto"></div>
                <h2 className="text-2xl font-medium text-foreground font-display">
                    Page Not Found
                </h2>
                <p className="text-muted-foreground font-body">
                    The page you are looking for does not exist.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-background border border-border hover:bg-secondary transition-colors duration-200"
                >
                    Go Home
                </a>
            </div>
        </div>
    )
}
