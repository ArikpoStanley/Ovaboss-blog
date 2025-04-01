# Blog System Backend (Laravel 12)

A RESTful API for a simple blog system built with Laravel 12. This API provides endpoints for user authentication, blog post management, and a commenting system.

## Features

- User authentication using Laravel Sanctum
- CRUD operations for blog posts
- Commenting system
- Image uploads for blog posts
- Search and filtering capabilities
- Soft deletes for posts and comments

## Requirements

- PHP 8.2+
- Composer
- MySQL 8.0+
- Laravel 12

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blog-system.git
   cd blog-system/backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Configure your database in the `.env` file:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=blog_system
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. Run the migrations and seed the database:
   ```bash
   php artisan migrate --seed
   ```

7. Create a symbolic link for storage:
   ```bash
   php artisan storage:link
   ```

8. Start the development server:
   ```bash
   php artisan serve
   ```

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout (Authenticated users only)

### User Profile

- `GET /api/user` - Get authenticated user
- `PUT /api/user` - Update user profile

### Blog Posts

- `GET /api/posts` - List all posts (paginated)
- `GET /api/posts/{id}` - Get a single post with comments
- `POST /api/posts` - Create a new post (Authenticated users only)
- `PUT /api/posts/{id}` - Edit a post (Only the owner can edit)
- `DELETE /api/posts/{id}` - Delete a post (Only the owner can delete)

### Comments

- `POST /api/posts/{id}/comments` - Add a comment to a post (Authenticated users only)
- `DELETE /api/comments/{id}` - Delete a comment (Only the owner can delete)

## Response Structure

All API responses follow this structure:

```json
{
  "status": "success|error",
  "message": "A descriptive message (if applicable)",
  "data": {
    // The actual data returned by the endpoint
  },
  "meta": {
    // Pagination metadata (if applicable)
  }
}
```

## Testing

Run tests using PHPUnit:

```bash
php artisan test
```

## Demo Credentials

- Email: arikpostanley123@gmail.com
- Password: Stanley@123