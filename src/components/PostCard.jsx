import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import appwriteService from '../appwrite/config';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { LikeBtn } from './index';
import { useState } from 'react';

function PostCard({ $id, title, featuredImage, content, $createdAt, tags, authorName, author }) {
    const [imgError, setImgError] = useState(false);
    const navigate = useNavigate();

    // Function to strip HTML tags for excerpt
    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const cleanContent = stripHtml(content);
    const excerpt = cleanContent.length > 100 ? cleanContent.slice(0, 100) + '...' : cleanContent;
    const readTime = Math.ceil(cleanContent.split(' ').length / 200) || 1; 

    // Formatting date
    const date = new Date($createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <Card className="group h-full flex flex-col overflow-hidden border-0 bg-transparent relative">
            <div className="absolute inset-0 glass-card rounded-2xl z-0"></div>
            
            <Link to={`/post/${$id}`} className="relative aspect-[4/3] overflow-hidden rounded-t-2xl z-10 m-1 mb-0">
                {featuredImage && !imgError ? (() => {
                    const imgUrl = appwriteService.getFilePreview(featuredImage);
                    if (!imgUrl) { return <div className="w-full h-full flex items-center justify-center mesh-bg text-white/20"><span className="text-4xl opacity-50">✦</span></div>; }
                    return (
                        <img
                            src={imgUrl}
                            alt={title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    );
                })() : (
                    <div className="w-full h-full flex items-center justify-center mesh-bg text-white/20">
                        <span className="text-4xl opacity-50">✦</span>
                    </div>
                )}
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                     <div className="glass rounded-full p-2 hover:bg-white/20 transition-colors" onClick={(e) => e.preventDefault()}>
                        <LikeBtn postId={$id} />
                     </div>
                </div>
            </Link>
            
            <CardContent className="flex flex-col flex-1 p-5 relative z-10">
                <div className="flex gap-2 mb-3">
                     <Badge variant="outline" className="font-normal text-[10px] py-0 h-5 border-white/10 text-primary bg-primary/5">
                        Article
                    </Badge>
                     <span className="text-[10px] text-slate-500 flex items-center">{readTime} min read</span>
                </div>

                <Link to={`/post/${$id}`} className="block group-hover:text-primary transition-colors">
                    <h3 className="text-lg font-heading font-bold tracking-tight mb-2 line-clamp-2 leading-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-400 transition-all">
                        {title}
                    </h3>
                </Link>
                
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1 font-light">
                    {excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-white/10">
                            <AvatarFallback className="text-[10px] font-bold bg-primary text-white flex items-center justify-center">
                                {authorName ? authorName.charAt(0).toUpperCase() : 'A'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-slate-300">
                            {authorName || 'Anonymous'}
                        </span>
                    </div>
                    <span className="text-xs text-slate-500">{date}</span>
                </div>
            </CardContent>
        </Card>
    );
}

PostCard.propTypes = {
    $id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    featuredImage: PropTypes.string,
    content: PropTypes.string,
    $createdAt: PropTypes.string,
    tags: PropTypes.array,
    authorName: PropTypes.string,
    author: PropTypes.object,
};

export default PostCard;


