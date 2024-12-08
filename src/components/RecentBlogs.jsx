import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../appwrite/config';

const RecentBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await appwriteService.getAllPosts();
        
        if (response && response.documents) {
          const sortedPosts = response.documents
            .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
            .slice(0, 3);
          setPosts(sortedPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleBlogClick = (post) => {
    if (!authStatus) {
      window.alert("Please login to read the full post");
      navigate('/login');
      return;
    }
    navigate(`/post/${post.$id}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Recent Blog Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 h-48 rounded-t-lg"></div>
              <div className="p-5 bg-white rounded-b-lg">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Recent Blog Posts</h2>
        <div className="text-center text-red-600 p-4 bg-red-100 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Recent Blog Posts</h2>
        <p className="text-center text-gray-600">No posts available</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">Recent Blog Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post.$id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 hover:scale-105"
          >
            <div 
              onClick={() => handleBlogClick(post)} 
              className="cursor-pointer"
              role="button"
              aria-label={`Read ${post.title}`}
            >
              {post.featuredImage && (
                <img 
                  className="rounded-t-lg w-full h-48 object-cover" 
                  src={appwriteService.getFilePreview(post.featuredImage)} 
                  alt={`Cover image for ${post.title}`} 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Blog+Image';
                  }}
                />
              )}
            </div>
            <div className="p-5">
              <div 
                onClick={() => handleBlogClick(post)} 
                className="cursor-pointer"
                role="button"
                aria-label={`Read ${post.title}`}
              >
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  {post.title}
                </h5>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(post.$createdAt).toLocaleDateString()}
              </p>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {post.content && post.content.length > 100 
                  ? `${post.content.substring(0, 100)}...` 
                  : post.content}
              </p>
              <button
                onClick={() => handleBlogClick(post)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-300"
                aria-label={`Read more about ${post.title}`}
              >
                Read more
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBlog;
