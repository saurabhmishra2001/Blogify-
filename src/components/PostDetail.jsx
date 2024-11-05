import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config'; // Adjust the import based on your appwrite setup

const PostDetail = () => {
    const { id } = useParams(); // Get the post ID from the URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await appwriteService.getPostById(id); // Fetch post data by ID
                setPost(response);
            } catch (err) {
                setError('Failed to fetch post data.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="mb-4">{post.content}</p> {/* Assuming post has title and content */}
        </div>
    );
};

export default PostDetail; 