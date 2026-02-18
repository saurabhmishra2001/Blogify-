import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { PostCard } from '../components';
import { Button } from '../components/ui/button';
import FeaturedPost from '../components/FeaturedPost';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [featuredPost, setFeaturedPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);
    const authStatus = useSelector(state => state.auth.status);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = authStatus 
                    ? await appwriteService.getPosts([])
                    : await appwriteService.getPublicPosts();
                
                if (response?.documents?.length > 0) {
                    setFeaturedPost(response.documents[0]);
                    setRecentPosts(response.documents.slice(1));
                    setPosts(response.documents);
                } else {
                    setPosts([]); 
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([]);
            }
        };

        fetchPosts();
    }, [authStatus]);

    if (posts.length === 0) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-black text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 mesh-bg opacity-50 z-0"></div>
                <div className="relative z-10 max-w-4xl space-y-6 animate-fade-in-up">
                    <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 pb-4">
                        Thinking, <br /> Evolved.
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                        A curated digital space for stories that matter. Join the next generation of writers and readers.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        {authStatus ? (
                            <Link to="/add-post">
                                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-slate-200 transition-all font-semibold">
                                    Start Writing
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup">
                                    <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/20 transition-all font-semibold">
                                        Get Started
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button size="lg" variant="ghost" className="h-14 px-10 text-lg rounded-full text-slate-300 hover:text-white hover:bg-white/10 font-semibold">
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col w-full bg-background animate-fade-in pb-20 pt-24">
            <div className="container max-w-7xl px-4 md:px-6">
                
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter text-white mb-2">
                             Featured <span className="text-slate-500">Stories</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-light">Curated top picks for this week.</p>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[400px]">
                    
                    {/* Featured Item - Large 2x2 */}
                    {featuredPost && (
                        <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden glass-card shadow-2xl animate-fade-in-up">
                            <FeaturedPost {...featuredPost} />
                        </div>
                    )}

                    {/* Recent Items - 1x1 */}
                    {recentPosts.slice(0, 4).map((post, index) => (
                        <div 
                            key={post.$id} 
                            className={`rounded-3xl overflow-hidden glass-card animate-fade-in-up ${index === 0 || index === 3 ? 'md:col-span-1' : 'md:col-span-1'}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                             <PostCard authStatus={authStatus} authorName={post.authorName || 'Unknown'} {...post} />
                        </div>
                    ))}

                    {/* Newsletter Callout - 2x1 */}
                    <div className="md:col-span-2 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/5 p-8 flex flex-col justify-center items-start relative group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="relative z-10 max-w-lg">
                            <h3 className="text-3xl font-heading font-bold text-white mb-2">Stay in the loop</h3>
                            <p className="text-indigo-200 mb-6 font-light">Get the best stories delivered to your inbox weekly. No spam, ever.</p>
                            <div className="flex gap-2 w-full items-center">
                                <input type="email" placeholder="email@example.com" className="bg-white/10 border-white/10 text-white placeholder:text-white/60 rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary h-12" />
                                <Button className="rounded-full bg-white hover:bg-slate-100 h-12 px-6 font-bold shadow-lg shrink-0" style={{ color: '#000000' }}>Join</Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Remaining Items */}
                    {recentPosts.slice(4).map((post, index) => (
                        <div 
                           key={post.$id} 
                           className="rounded-3xl overflow-hidden glass-card animate-fade-in-up"
                           style={{ animationDelay: `${(index + 4) * 100}ms` }}
                        >
                            <PostCard authStatus={authStatus} authorName={post.authorName || 'Unknown'} {...post} />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}