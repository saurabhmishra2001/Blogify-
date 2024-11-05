# Blogify

Blogify is a simple blogging application built with React and Appwrite. This application allows users to create, read, update, and delete blog posts. It features a responsive design and a user-friendly interface.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (login/signup)
- Create, edit, and delete blog posts
- Rich text editor for post content
- Responsive design for mobile and desktop
- Image upload for featured posts
- Status management for posts (active/inactive)

## Technologies Used

- React
- Appwrite (Backend as a Service)
- Redux (for state management)
- Tailwind CSS (for styling)
- React Router (for routing)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blogify.git
   cd blogify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Appwrite server and configure the `appwrite/config.js` file with your project credentials.

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## Usage

- **Creating a Post**: Navigate to the "Add Post" page to create a new blog post. Fill in the title, slug, content, and upload a featured image.
- **Viewing Posts**: Navigate to the "All Posts" page to view all published posts. Click on "Read More" to view the full content of a post.
- **Editing a Post**: Click on the edit button next to a post to modify its content.
- **Deleting a Post**: Click on the delete button to remove a post.

## Folder Structure


/blogify
├── /public
│ └── index.html
├── /src
│ ├── /appwrite
│ │ └── config.js
│ ├── /components
│ │ ├── /post-form
│ │ │ └── PostForm.jsx
│ │ ├── /post-card
│ │ │ └── PostCard.jsx
│ │ ├── /read-more
│ │ │ └── ReadMore.jsx
│ │ ├── /post-detail
│ │ │ └── PostDetail.jsx
│ │ └── index.js
│ ├── /pages
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Signup.jsx
│ │ ├── AllPosts.jsx
│ │ ├── AddPost.jsx
│ │ ├── EditPost.jsx
│ │ └── Post.jsx
│ ├── /store
│ │ └── store.js
│ ├── App.jsx
│ └── index.js
└── package.json



## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.