import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // Add this import statement
import appwriteService from '../appwrite/config';
import { Card, CardContent, CardFooter } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

function PostCard({ $id, title, featuredImage, content, $createdAt, author, authorName }) {
    // Function to strip HTML tags
    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const cleanContent = stripHtml(content);
    const readTime = Math.ceil(cleanContent.split(' ').length / 200); // Estimate read time based on word count
    const excerpt = cleanContent.slice(0, 100) + (cleanContent.length > 100 ? '...' : '');
    const tags = ['Blog']; // You can make this dynamic based on your data

    const formattedDate = $createdAt
        ? new Date($createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Unknown Date'; // Fallback for invalid/missing dates

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-video">
                {featuredImage && (
                    <img
                        src={appwriteService.getFilePreview(featuredImage)}
                        alt={title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x400?text=Blog+Post';
                        }}
                    />
                )}
            </div>
            <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">
                    <Link 
                        to={`/post/${$id}`} 
                        className="hover:text-primary transition-colors"
                    >
                        {title}
                    </Link>
                </h3>
                <p className="text-muted-foreground mb-4">{excerpt}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                        {author?.profileImage ? (
                            <AvatarImage src={author.profileImage} alt={authorName || 'User'} />
                        ) : (
                            <AvatarFallback>
                                {authorName?.charAt(0) || 'A'}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <span className="text-sm font-medium">{authorName || 'Anonymous'}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                    <time dateTime={new Date($createdAt).toISOString()}>
                        {formattedDate}
                    </time>
                    <span className="mx-1">•</span>
                    <span>{readTime} min read</span>
                </div>
            </CardFooter>
        </Card>
    );
}

PostCard.propTypes = {
    $id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    featuredImage: PropTypes.string,
    content: PropTypes.string.isRequired,
    $createdAt: PropTypes.string.isRequired,
    author: PropTypes.object.isRequired,
    authorName: PropTypes.string,
};

export default PostCard;
