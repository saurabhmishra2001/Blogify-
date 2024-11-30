import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecentBlog = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const posts = [
    {
      id: 1,
      title: 'How to Learn React',
      excerpt: 'Learn how to build scalable and performant web applications with React.',
      date: 'November 20, 2024',
      image: '/path/to/image1.jpg', // Replace with actual image URLs
    },
    {
      id: 2,
      title: 'JavaScript Tips and Tricks',
      excerpt: 'Boost your JavaScript skills with these essential tips.',
      date: 'November 18, 2024',
      image: '/path/to/image2.jpg',
    },
    {
      id: 3,
      title: 'CSS Grid Layouts Explained',
      excerpt: 'A comprehensive guide to mastering CSS Grid Layouts.',
      date: 'November 15, 2024',
      image: '/path/to/image3.jpg',
    },
    {
      id: 4,
      title: 'Mastering React Hooks',
      excerpt: 'Deep dive into React Hooks and how to use them effectively.',
      date: 'November 10, 2024',
      image: '/path/to/image4.jpg',
    },
    {
      id: 5,
      title: 'The Power of TypeScript',
      excerpt: 'Understand the advantages of TypeScript for JavaScript development.',
      date: 'November 5, 2024',
      image: '/path/to/image5.jpg',
    },
    {
      id: 6,
      title: 'Understanding Async/Await',
      excerpt: 'Learn the async/await pattern in JavaScript for better asynchronous code.',
      date: 'October 30, 2024',
      image: '/path/to/image6.jpg',
    },
  ];

  const handleBlogClick = (post) => {
    if (!authStatus) {
      alert("Please login first.");
      return;
    }

    navigate(`/post/${post.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-100">
      {/* Blog List - Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <a href="#" onClick={() => handleBlogClick(post)}>
              <img className="rounded-t-lg" src={post.image} alt={post.title} />
            </a>
            <div className="p-5">
              <a href="#" onClick={() => handleBlogClick(post)}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {post.title}
                </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.excerpt}</p>
              <a
                href="#"
                onClick={() => handleBlogClick(post)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBlog;
