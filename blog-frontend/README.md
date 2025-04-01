# Blog System Frontend

This is the frontend of a simple blog system built with React. It allows users to create, read, update, and delete blog posts, as well as comment on posts.

## Features

- **User Authentication**
  - Register with email and password
  - Login/logout functionality
  - Profile management (update name and email)

- **Blog Posts Management**
  - Create new posts (with optional image upload)
  - Edit and delete your own posts
  - View all posts with pagination

- **Comments System**
  - Add comments to any post
  - Delete your own comments
  - View all comments on a post

- **Search & Filtering**
  - Search posts by title
  - Filter posts by author

## Technologies Used

- React 18+ (Vite)
- React Router for navigation
- Axios for API communication
- Tailwind CSS for styling
- React Context API for state management

## Project Structure

```
/src
  /assets          # Static assets like images
  /components      # Reusable UI components
  /contexts        # Context providers (AuthContext, etc.)
  /hooks           # Custom hooks
  /layouts         # Layout components
  /pages           # Page components
  /utils           # Utility functions and configs
  App.jsx          # Main application component
  main.jsx         # Entry point
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Pages and Routes

- `/` - Home page with list of all blog posts
- `/login` - User login page
- `/register` - User registration page
- `/profile` - User profile management
- `/dashboard` - User dashboard showing all posts with search and filtering
- `/posts/:id` - Single post view with comments
- `/create-post` - Create and edit a new blog post

## API Integration

The frontend communicates with the Laravel backend API using Axios. The base configuration can be found in `/src/utils/axiosConfig.js`.

### Key Endpoints Used:

- **Authentication**
  - `POST /api/register` - Register a new user
  - `POST /api/login` - User login
  - `POST /api/logout` - User logout
  - `GET /api/user` - Get authenticated user data
  - `PUT /api/user` - Update user profile

- **Blog Posts**
  - `GET /api/posts` - List all posts (paginated)
  - `GET /api/posts/{id}` - Get a single post with comments
  - `POST /api/posts` - Create a new post
  - `PUT /api/posts/{id}` - Edit a post
  - `DELETE /api/posts/{id}` - Delete a post

- **Comments**
  - `POST /api/posts/{id}/comments` - Add a comment to a post
  - `DELETE /api/comments/{id}` - Delete a comment

## Authentication Flow

The application uses Laravel Sanctum for authentication. When a user logs in, a token is stored in the browser's localStorage. This token is included in the Authorization header for all subsequent API requests.

The `useAuth` custom hook provides authentication state and methods throughout the application.

## Form Handling

Form validation is implemented on the frontend to provide immediate feedback to users. All inputs are validated before submitting to the API.

For image uploads, the application uses FormData to send multipart/form-data requests.

## Deployment

To build for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory and can be deployed to any static hosting service.

## Development Notes

- Make sure the Laravel backend is running and accessible at the URL specified in your `.env` file.
- The frontend implements client-side pagination for author filtering when the backend doesn't support it.
- All dates are formatted using the browser's `toLocaleDateString()` method.