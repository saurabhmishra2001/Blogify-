import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import PropTypes from 'prop-types';

 function Post({ $id, title, featuredImage, content, $createdAt, tags }) {
    
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    appwriteService.getUserById(post.userId).then((userData) => {
                        setPost({ 
                            ...post, 
                            authorName: userData.name,
                            author: userData
                        });
                    });
                } else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <article className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 gradient-text">
                        {post.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                        <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                                {post.author?.profileImage ? (
                                    <AvatarImage src={post.author.profileImage} alt={post.authorName || 'User'} />
                                ) : (
                                    <AvatarFallback>{post.authorName?.charAt(0) || 'A'}</AvatarFallback>
                                )}
                            </Avatar>
                            <span className="text-sm font-medium">{post.authorName || 'Anonymous'}</span>
                        </div>
                        <div className="text-sm">
                            <time dateTime={new Date(post.$createdAt).toISOString()}>
                                {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                        {isAuthor && (
                            <div className="flex gap-2 ml-auto">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-600 hover:text-red-700"
                                    onClick={deletePost}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                    <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="prose prose-lg max-w-none">
                    {parse(post.content)}
                </div>
            </article>
        </div>
    ) : (
        <div className="container mx-auto py-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
}

Post.propTypes = {
    $id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    featuredImage: PropTypes.string,
    content: PropTypes.string.isRequired,
    $createdAt: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    authorName: PropTypes.string.isRequired,
    author: PropTypes.shape({
        name: PropTypes.string,
        profileImage: PropTypes.string,
    }),
    isAuthor: PropTypes.bool, // Whether the logged-in user is the author
};

export default Post;

