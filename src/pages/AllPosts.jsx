import { useEffect, useState } from 'react';
import { PostCard } from '../components';
import appwriteService from '../appwrite/config';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteService.getPosts([]).then((response) => {
            if (response) {
                setPosts(response.documents);
            }
        });
    }, []);

    return (
        <div className="w-full py-8">
            <div className="container px-4 md:px-6">
                <h1 className="text-4xl font-extrabold tracking-tight mb-10 gradient-text text-center">
                    All Articles
                </h1>
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            No articles found.
                        </p>
                    </div>
                ) : (
                    <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                        {
                            posts.map((post) => (
                                <PostCard key={post.$id} {...post} />
                            ))
                        }

                    </div>

                )}
            </div>
        </div>
    );
}
