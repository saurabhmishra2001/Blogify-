import { useEffect, useState } from 'react';
import { PostCard } from '..';
import { Newsletter } from './Newsletter';
import { Input } from "../ui/input";
import appwriteService from '../../appwrite/config';
import { useSelector } from 'react-redux';

export default function ExplorePage() {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const authStatus = useSelector(state => state.auth.status);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = authStatus 
                    ? await appwriteService.getPosts([])
                    : await appwriteService.getPublicPosts();
                
                if (response?.documents) {
                    setPosts(response.documents);
                    setFilteredPosts(response.documents);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([]);
                setFilteredPosts([]);
            }
        };

        fetchPosts();
    }, [authStatus]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(query) ||
            (post.content && post.content.toLowerCase().includes(query))
        );
        setFilteredPosts(filtered);
    }, [searchQuery, posts]);

    return (
        <div className="min-h-screen flex flex-col w-full animate-fade-in bg-background">
            <main className="flex-1">
                {/* Hero Search Section */}
                <section className="relative py-32 overflow-hidden">
                    <div className="absolute inset-0 mesh-bg opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
                    
                    <div className="container relative z-10 px-4 md:px-6 text-center max-w-3xl mx-auto space-y-8">
                        <div className="animate-fade-in-up">
                            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-white mb-6 drop-shadow-xl">
                                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Ideas</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                                Dive into a universe of stories, tutorials, and insights from our community of creators.
                            </p>
                        </div>
                        
                        <div className="relative max-w-xl mx-auto group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex w-full bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl items-center p-2">
                                <div className="pl-4 pr-2">
                                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Search for articles, topics, or authors..." 
                                    className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-500 focus:ring-0 text-lg h-12"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Results Section */}
                <section className="container py-12 px-4 md:px-6">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-32 rounded-3xl border border-dashed border-white/10 bg-white/5 animate-fade-in-up">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
                                <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
                            <p className="text-slate-400 max-w-md mx-auto">
                                We couldn't find anything matching "{searchQuery}". Try adjusting your search keywords.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post, index) => (
                                <div 
                                    key={post.$id} 
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <PostCard authStatus={authStatus} authorName={post.authorName} {...post} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                
                <section className="container py-24 px-4 md:px-6 border-t border-white/5">
                    <Newsletter />
                </section>
            </main>
        </div>
    );
}

