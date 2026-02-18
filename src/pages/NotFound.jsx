import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-8 relative z-10 animate-fade-in">
                {/* Giant 404 */}
                <div className="relative">
                    <h1 className="text-[10rem] md:text-[16rem] font-heading font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="glass-card rounded-3xl px-8 py-5 border border-white/10">
                            <span className="text-4xl">🔍</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
                        Page not found
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/">
                        <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                            Go Home
                        </Button>
                    </Link>
                    <Link to="/all-posts">
                        <Button variant="outline" className="rounded-full border-white/10 text-slate-300 hover:text-white hover:bg-white/5 px-8 gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                            Browse Articles
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
