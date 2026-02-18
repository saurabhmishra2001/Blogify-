import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { LikeBtn } from "../components";
import { toast } from 'react-toastify';
import { Badge } from "../components/ui/badge";
import ReadingProgress from "../components/ReadingProgress";
import BackToTop from "../components/BackToTop";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            setLoading(true);
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                    setLoading(false);
                    setImageError(false);
                } else {
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                toast.success("Post deleted successfully");
                navigate("/");
            }
        });
        setShowDeleteModal(false);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="min-h-screen animate-pulse bg-background">
                <div className="w-full h-[60vh] bg-muted/20"></div>
                <div className="container max-w-3xl mx-auto -mt-32 relative z-10 px-4">
                     <div className="bg-card glass-card rounded-3xl p-12 space-y-6">
                        <div className="h-4 w-32 bg-muted/50 rounded-full mb-4"></div>
                        <div className="h-12 w-3/4 bg-muted/50 rounded-lg"></div>
                        <div className="h-6 w-1/2 bg-muted/50 rounded-lg"></div>
                        <div className="space-y-4 pt-8">
                             {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 w-full bg-muted/30 rounded"></div>)}
                        </div>
                     </div>
                </div>
            </div>
        );
    }

    if (!post) return null;

    const formattedDate = new Date(post.$createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Estimate read time
    const textContent = post.content ? post.content.replace(/<[^>]*>?/gm, '') : '';
    const readTime = Math.ceil((textContent.split(/\s+/).length || 0) / 200);

    return (
        <div className="min-h-screen pb-20 animate-fade-in bg-background">
            <ReadingProgress />
            <BackToTop />
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onConfirm={deletePost}
                onCancel={() => setShowDeleteModal(false)}
            />
            
            {/* Immersive Hero Section */}
            <div className="relative w-full h-[70vh] min-h-[600px] flex items-end justify-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {post.featuredImage && !imageError ? (
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                         <div className="w-full h-full mesh-bg flex items-center justify-center opacity-50">
                            <span className="text-9xl opacity-20 filter blur-sm">✨</span>
                         </div>
                    )}
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
                     <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Hero Content */}
                <div className="container mx-auto max-w-4xl relative z-10 p-6 md:p-12 text-center space-y-8 mb-12">
                     <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up">
                        <Badge variant="outline" className="border-white/20 text-white/90 bg-white/5 backdrop-blur-sm px-4 py-1">
                            Article
                        </Badge>
                        <span className="text-white/60 flex items-center text-sm font-medium">
                            <span className="w-1 h-1 rounded-full bg-white/50 mr-3"></span>
                            {readTime} min read
                        </span>
                        <span className="text-white/60 flex items-center text-sm font-medium">
                            <span className="w-1 h-1 rounded-full bg-white/50 mr-3"></span>
                            {formattedDate}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-white drop-shadow-xl text-balance leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        {post.title}
                    </h1>

                     <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center gap-3 pl-2 pr-6 py-2 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
                            <Avatar className="h-10 w-10 border border-white/20">
                                {/* Since we don't usually store author profile images in posts, fallback is primary */}
                                <AvatarFallback className="bg-primary text-white font-bold flex items-center justify-center">
                                    {post.authorName?.charAt(0).toUpperCase() || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-left">
                                <span className="text-sm font-semibold text-white leading-none mb-0.5">{post.authorName || 'Anonymous'}</span>
                                <span className="text-xs text-white/60 font-medium">Author</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto max-w-3xl px-4 md:px-6 relative z-20">
                
                {/* Sticky Action Bar */}
                <div className="sticky top-24 z-50 -mt-8 mb-12 flex justify-center pointer-events-none">
                    <div className="glass rounded-full p-2 px-4 flex items-center gap-2 shadow-2xl animate-fade-in-up pointer-events-auto border-white/10 scale-90 md:scale-100 origin-top">
                        <div className="px-2">
                             <LikeBtn postId={post.$id} />
                        </div>
                        <div className="w-px h-6 bg-white/10 mx-1"></div>
                        <Button variant="ghost" size="sm" onClick={handleShare} className="rounded-full text-slate-400 hover:text-white hover:bg-white/10">
                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                             Share
                        </Button>
                        
                        {isAuthor && (
                            <>
                                <div className="w-px h-6 bg-white/10 mx-1"></div>
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button variant="ghost" size="sm" className="rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        Edit
                                    </Button>
                                </Link>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="rounded-full text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Article Body */}
                <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                    prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
                    prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-light
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-semibold
                    prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-white/5
                    prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-slate-200
                    prose-code:bg-white/10 prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5 prose-code:text-primary-foreground prose-code:font-mono prose-code:text-sm
                    prose-hr:border-white/10
                    [&>*:first-child]:mt-0
                ">
                    {parse(post.content)}
                </article>

                {/* Footer Section */}
                <div className="mt-20 pt-12 border-t border-white/5 flex flex-col items-center text-center space-y-8 animate-fade-in-up">
                    <div className="p-8 rounded-3xl glass-card max-w-xl w-full">
                        <h3 className="text-2xl font-heading font-bold text-white mb-4">Enjoyed this story?</h3>
                        <p className="text-slate-400 mb-6">
                            Subscribe to get the latest posts from {post.authorName || 'the author'} delivered right to your inbox.
                        </p>
                        <div className="flex gap-2">
                             <input type="email" placeholder="Your email address" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary" />
                             <Button className="rounded-full bg-primary hover:bg-primary/90 text-white">Subscribe</Button>
                        </div>
                    </div>
                    
                    <Link to="/all-posts">
                        <Button variant="ghost" className="gap-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                             Read more articles
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}


