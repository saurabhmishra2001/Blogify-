import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

export default function LikeBtn({ postId }) {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        setLiked(!!likedPosts[postId]);
    }, [postId]);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
        
        if (liked) {
            delete likedPosts[postId];
        } else {
            likedPosts[postId] = true;
        }

        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        setLiked(!liked);
    };

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            className={`group flex items-center gap-1 transition-all duration-300 ${liked ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20' : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'}`}
            onClick={handleLike}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={liked ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`w-5 h-5 transition-transform duration-300 ${liked ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}
            >
                <path d="M19 14c1.49-1.28 3-2.83 3-4.7C22 4.8 17.49 2 15 4c-1.12.9-2.09 2.15-3 3.48C11.09 6.15 10.12 4.9 9 4 6.51 2 2 4.8 2 9.3c0 1.87 1.51 3.42 3 4.7l7 6.3 7-6.3z" />
            </svg>
            <span className={`text-xs font-medium ${liked ? 'text-red-500' : 'text-muted-foreground'}`}>
                {liked ? 'Liked' : 'Like'}
            </span>
        </Button>
    );
}
