import { useEffect, useState, useMemo } from 'react';
import { PostCard } from '../components';
import appwriteService from '../appwrite/config';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const authStatus = useSelector(state => state.auth.status);

    useEffect(() => {
        setLoading(true);
        appwriteService.getPosts([]).then((response) => {
            if (response) setPosts(response.documents);
            setLoading(false);
        });
    }, []);

    const filtered = useMemo(() => {
        let result = [...posts];
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(q) ||
                p.content?.toLowerCase().includes(q) ||
                p.authorName?.toLowerCase().includes(q)
            );
        }
        if (sortBy === 'newest') result.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
        else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt));
        else if (sortBy === 'title') result.sort((a, b) => a.title?.localeCompare(b.title));
        return result;
    }, [posts, search, sortBy]);

    if (loading) {
        return (
            <div className="min-h-screen py-12 container px-4 md:px-6">
                <div className="space-y-4 mb-8 text-center">
                    <div className="h-10 w-48 bg-muted rounded mx-auto animate-pulse"></div>
                    <div className="h-4 w-64 bg-muted rounded mx-auto animate-pulse"></div>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-[400px] bg-muted/30 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 w-full animate-fade-in bg-background">
            <div className="container max-w-7xl px-4 md:px-6">

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        All Articles
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        Explore our collection of stories, tutorials, and updates.
                    </p>
                </div>

                {/* Search + Sort Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-2xl mx-auto">
                    <div className="relative flex-1">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search articles, authors..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full h-12 pl-10 pr-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        )}
                    </div>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="h-12 px-4 rounded-full bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                        <option value="newest" className="bg-zinc-900">Newest First</option>
                        <option value="oldest" className="bg-zinc-900">Oldest First</option>
                        <option value="title" className="bg-zinc-900">A → Z</option>
                    </select>
                </div>

                {/* Results count */}
                {search && (
                    <p className="text-center text-slate-500 text-sm mb-8">
                        {filtered.length === 0 ? 'No results' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`} for "<span className="text-white">{search}</span>"
                    </p>
                )}

                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 glass-card rounded-3xl border border-dashed border-white/10">
                        <div className="h-24 w-24 bg-white/5 rounded-2xl flex items-center justify-center text-4xl">📝</div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-white">No articles yet</h3>
                            <p className="text-muted-foreground max-w-sm">Be the first to publish a story on Blogify.</p>
                        </div>
                        {authStatus && (
                            <Link to="/add-post">
                                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white">Write an Article</Button>
                            </Link>
                        )}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 glass-card rounded-3xl border border-white/5">
                        <div className="text-5xl">🔍</div>
                        <h3 className="text-xl font-semibold text-white">No matches found</h3>
                        <p className="text-slate-400 text-sm">Try different keywords or clear the search.</p>
                        <Button variant="ghost" onClick={() => setSearch('')} className="rounded-full text-primary hover:text-primary/80">
                            Clear search
                        </Button>
                    </div>
                ) : (
                    <div className='grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'>
                        {filtered.map((post, index) => (
                            <div
                                key={post.$id}
                                className="animate-fade-in-up rounded-3xl overflow-hidden glass-card"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <PostCard authStatus={authStatus} authorName={post.authorName} {...post} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
