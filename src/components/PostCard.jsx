import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import appwriteService from '../appwrite/config';
import { Card, CardContent, CardFooter } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { toast } from 'react-toastify'; // For toast notifications
import { useSelector } from 'react-redux';

function UnifiedCard({ $id, title, featuredImage, content, $createdAt, tags, authorName, author }) {
    const navigate = useNavigate();

    // Function to strip HTML tags
    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const cleanContent = stripHtml(content);
    const readTime = Math.ceil(cleanContent.split(' ').length / 200); // Estimate read time based on word count
    const excerpt = cleanContent.slice(0, 150) + (cleanContent.length > 150 ? '...' : '');
    const authStatus = useSelector(state => state.auth.status);

    const formattedDate = $createdAt
        ? new Date($createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Unknown Date';

    const handleReadMore = () => {
        if (authStatus) {
            // If the user is logged in, navigate to the post page
            navigate(`/post/${$id}`);
        } else {
            // If the user is not logged in, show a toast and redirect to the login page
            toast.info('Please log in to read the post!');
            navigate('/login'); // Redirect to login page
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow w-full flex flex-col">
            <div className="relative h-40">
                {featuredImage && (
                    <img
                        src={appwriteService.getFilePreview(featuredImage)}
                        alt={title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x400?text=Post';
                        }}
                    />
                )}
            </div>
            <CardContent className="p-6 flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">
                    <Link to={`/post/${$id}`} className="hover:text-primary transition-colors">
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
                            <AvatarFallback>{authorName?.charAt(0) || 'A'}</AvatarFallback>
                        )}
                    </Avatar>
                    <span className="text-sm font-medium">{authorName || 'Anonymous'}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                    <time dateTime={$createdAt ? new Date($createdAt).toISOString() : undefined}>
                        {formattedDate}
                    </time>
                    <span className="mx-1">•</span>
                    <span>{readTime} min read</span>
                </div>
            </CardFooter>
            <div className="p-6 flex justify-end">
                <button
                    onClick={handleReadMore}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Read More
                </button>
            </div>
        </Card>
    );
}

UnifiedCard.propTypes = {
    $id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    featuredImage: PropTypes.string,
    content: PropTypes.string.isRequired,
    $createdAt: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    authorName: PropTypes.string,
    author: PropTypes.shape({
        name: PropTypes.string,
        profileImage: PropTypes.string,
    }),
    authStatus: PropTypes.bool.isRequired, // Add authStatus to prop types
};

export default UnifiedCard;
