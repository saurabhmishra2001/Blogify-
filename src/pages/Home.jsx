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
                    setRecentPosts(response.documents.slice(1, 4));
                    setPosts(response.documents);
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
            <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                    <section className="bg-gradient-to-br from-primary/20 via-background to-secondary/20 py-20">
                        <div className="container">
                            <div className="text-center max-w-3xl mx-auto">
                                <h1 className="text-5xl font-bold tracking-tight mb-6 gradient-text">
                                    Welcome to Blogify
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8">
                                    {authStatus 
                                        ? "No posts found. Be the first to share your thoughts!"
                                        : "Join our community to start reading and writing amazing articles."}
                                </p>
                                <div className="flex justify-center gap-6">
                                    {authStatus ? (
                                        <Link to="/add-post">
                                            <Button 
                                                size="lg" 
                                                className="font-medium px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50"
                                            >
                                                <span className="flex items-center gap-2">
                                                    Create First Post
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </span>
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to="/login">
                                                <Button 
                                                    size="lg" 
                                                    variant="ghost"
                                                    className="font-medium px-8 py-6 hover:bg-primary/10 transition-all duration-300 transform hover:scale-105"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        Login
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                        </svg>
                                                    </span>
                                                </Button>
                                            </Link>
                                            <Link to="/signup">
                                                <Button 
                                                    size="lg" 
                                                    className="font-medium px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        Sign Up
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </span>
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <section className="bg-gradient-to-br from-primary/20 via-background to-secondary/20 py-20">
                    <div className="container">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-5xl font-bold tracking-tight mb-6 gradient-text animate-fade-in">
                                Welcome to Blogify
                            </h1>
                            <p className="text-xl text-muted-foreground mb-12">
                                Discover insightful articles, share your expertise, and connect with a community of passionate writers and readers.
                            </p>
                            <div className="flex justify-center gap-6">
                                <Link to={authStatus ? "/explore" : "/signup"}>
                                    <Button 
                                        size="lg" 
                                        className="font-medium px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50"
                                    >
                                        <span className="flex items-center gap-2">
                                            Explore Articles
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </Button>
                                </Link>
                                <Link to={authStatus ? "/add-post" : "/signup"}>
                                    <Button 
                                        size="lg" 
                                        variant="outline" 
                                        className="font-medium px-8 py-6 border-2 hover:bg-primary/10 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <span className="flex items-center gap-2">
                                            Start Writing
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {authStatus && featuredPost &&(
                    <section className="container py-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-8 gradient-text">
                            Featured Article
                        </h2>
                        <FeaturedPost {...featuredPost} />
                    </section>
                )}

                {recentPosts.length > 0 && (
                    <section className="container py-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-8 gradient-text">
                            Recent Articles
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {recentPosts.map((post) => (
                                <PostCard key={post.$id} {...post} />
                            ))}
                        </div>
                    </section>
                )}

                <section className="bg-gradient-to-br from-background to-primary/10 py-16">
                    <div className="container">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight mb-6 gradient-text">
                                Join Our Writing Community
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                Share your knowledge, gain insights, and connect with fellow writers and readers from around the world.
                            </p>
                            <Link to={authStatus ? "/add-post" : "/signup"}>
                                <Button 
                                    size="lg" 
                                    className="font-medium px-8 py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50"
                                >
                                    {authStatus ? "Start Writing" : "Get Started"}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}