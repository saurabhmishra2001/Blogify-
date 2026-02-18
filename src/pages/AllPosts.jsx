import { useEffect, useState } from 'react';
import { PostCard } from '../components';
import appwriteService from '../appwrite/config';
import { useSelector } from 'react-redux';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const authStatus = useSelector(state => state.auth.status);

    useEffect(() => {
        setLoading(true);
        appwriteService.getPosts([]).then((response) => {
            if (response) {
                setPosts(response.documents);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen py-12 container px-4 md:px-6">
                <div className="space-y-4 mb-8 text-center">
                    <div className="h-10 w-48 bg-muted rounded mx-auto animate-pulse"></div>
                    <div className="h-4 w-64 bg-muted rounded mx-auto animate-pulse"></div>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-[400px] bg-muted rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 w-full animate-fade-in bg-background">
            <div className="container max-w-7xl px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        All Articles
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        Explore our collection of stories, tutorials, and updates.
                    </p>
                </div>
                
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-secondary/20 rounded-3xl border border-dashed border-border">
                        <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center text-4xl">
                            📝
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No articles yet</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Be the first to publish a story on Blogify.
                            </p>
                        </div>
                        {authStatus && (
                            <Link to="/add-post">
                                <Button size="lg" className="rounded-full">
                                    Write an Article
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className='grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'>
                        {posts.map((post, index) => (
                            <div 
                                key={post.$id} 
                                className="animate-fade-in-up"
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

