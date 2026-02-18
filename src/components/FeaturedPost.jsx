import { Link } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import PropTypes from 'prop-types';
import { Card, CardContent } from './ui/card';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function FeaturedPost({ $id, title, featuredImage, content, $createdAt, authorName, author }) {
    
    const formattedDate = new Date($createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="relative h-full w-full group overflow-hidden rounded-3xl">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {featuredImage ? (
                    <img
                        src={appwriteService.getFilePreview(featuredImage)}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full mesh-bg flex items-center justify-center">
                        <span className="text-9xl opacity-20">✨</span>
                    </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-10 p-6 md:p-10 flex flex-col justify-end">
                <div className="space-y-4 max-w-3xl animate-fade-in-up">
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-white/80">
                        <Badge className="bg-primary hover:bg-primary/90 text-white border-0 px-3">Featured</Badge>
                        <span className="w-1 h-1 rounded-full bg-white/50"></span>
                        <span>{formattedDate}</span>
                        <span className="w-1 h-1 rounded-full bg-white/50"></span>
                        <span>{authorName || 'Editor'}</span>
                    </div>

                    <Link to={`/post/${$id}`} className="block group/link">
                       <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight text-white mb-2 group-hover/link:text-primary transition-colors">
                            {title}
                        </h2>
                    </Link>
                    
                    <p className="text-lg text-slate-300 line-clamp-2 md:w-3/4">
                       The featured story of the day. Dive into a world of insights and premium content curated just for you.
                    </p>

                    <div className="pt-6">
                        <Link to={`/post/${$id}`}>
                            <Button size="lg" className="rounded-full bg-white hover:bg-slate-100 px-8 font-semibold shadow-lg hover:shadow-white/20 gap-2 transition-all" style={{ color: '#000000' }}>
                                Read Article
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

FeaturedPost.propTypes = {
    $id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    featuredImage: PropTypes.string,
    content: PropTypes.string,
    $createdAt: PropTypes.string,
    authorName: PropTypes.string,
    author: PropTypes.object
};

export default FeaturedPost;

