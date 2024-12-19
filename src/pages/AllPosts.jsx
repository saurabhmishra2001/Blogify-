import { useEffect, useState } from 'react';
import { PostCard } from '../components';
import appwriteService from '../appwrite/config';
import { useSelector } from 'react-redux';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const userData = useSelector((state) => state.auth.userData); // Get logged-in user data

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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                        {posts.map((post) => (
                            <div key={post.$id} className="w-full">
                                <PostCard
                                    {...post}
                                    isAuthor={userData?.name === post.authorName} // Check if the logged-in user is the author
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
