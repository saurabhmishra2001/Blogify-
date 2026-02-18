import { useEffect, useState } from 'react';

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(Math.min(100, Math.max(0, pct)));
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-white/5">
            <div
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(139,92,246,0.7)]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
