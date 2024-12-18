import { useEffect, useState } from 'react';
import { Header, Footer, PostCard } from '..';
import { Newsletter } from './Newsletter';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
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

    const handleSearch = () => {
        const filtered = posts.filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosts(filtered);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <section className="container py-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-6 gradient-text">
                        Explore Articles
                    </h1>
                    <div className="flex gap-4 mb-8">
                        <Input 
                            placeholder="Search articles..." 
                            className="max-w-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch}>
                            <svg 
                                className="h-4 w-4 mr-2" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                />
                            </svg>
                            Search
                        </Button>
                    </div>
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                No articles found. Try a different search term.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post) => (
                                <PostCard key={post.$id} {...post} />
                            ))}
                        </div>
                    )}
                </section>
                <section className="container py-16">
                    <Newsletter />
                </section>
            </main>
        </div>
    );
} 