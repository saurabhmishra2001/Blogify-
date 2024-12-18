import { Link } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import PropTypes from 'prop-types';
import { Card, CardContent, CardFooter } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useSelector } from 'react-redux';

function FeaturedPost({ $id, title, featuredImage, content, $createdAt, author }) {
    // Function to strip HTML tags
    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const cleanContent = stripHtml(content);
    const readTime = Math.ceil(cleanContent.split(' ').length / 200); // Estimate read time based on word count
    const excerpt = cleanContent.slice(0, 150) + (cleanContent.length > 150 ? '...' : '');
    const tags = ['Featured', 'Latest']; // You can make this dynamic based on your data
    const userData = useSelector((state) => state.auth.userData);

    return (
        <Card className="overflow-hidden">
            <div className="relative aspect-video">
                {featuredImage && (
                    <img
                        src={appwriteService.getFilePreview(featuredImage)}
                        alt={title}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/1200x600?text=Featured+Post';
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
                <h3 className="text-2xl font-bold tracking-tight mb-2">
                    <Link 
                        to={`/post/${$id}`} 
                        className="hover:text-primary transition-colors"
                    >
                        {title}
                    </Link>
                </h3>
                <div className="text-muted-foreground mb-4">{excerpt}</div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                        {userData?.profileImage ? (
                            <AvatarImage src={userData.profileImage} alt={author.name} />
                        ) : (
                            <AvatarFallback>{userData?.name?.charAt(0) || 'A'}</AvatarFallback>
                        )}
                    </Avatar>
                    <span className="text-sm font-medium">{userData?.name || 'Anonymous'}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                    <time dateTime={new Date($createdAt).toISOString()}>
                        {new Date($createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                    <span className="mx-1">•</span>
                    <span>{readTime} min read</span>
                </div>
            </CardFooter>
        </Card>
    );
}

FeaturedPost.propTypes = {
    $id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    featuredImage: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    $createdAt: PropTypes.string.isRequired,
    author: PropTypes.shape({
        name: PropTypes.string,
        profileImage: PropTypes.string
    })
};

export default FeaturedPost; 