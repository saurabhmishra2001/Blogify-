import React from 'react';
import { useLocation } from 'react-router-dom';
import PostDetail from '../components/PostDetail'; // Import the PostDetail component

const ReadMore = () => {
    const location = useLocation();
    const { id } = location.state || { id: null }; // Get the post ID from state

    if (!id) {
        return <div>No post selected.</div>; // Handle case where no ID is provided
    }

    return (
        <div>
            <PostDetail id={id} /> {/* Render the PostDetail component */}
        </div>
    );
};

export default ReadMore; 