# API Documentation

## Authentication Endpoints

### Register User

**POST** `/api/auth/register`

```json
{
  "name": "Your Name",
  "email": "username@gmail.com",
  "password": "password123"
}
```
**POST** `/api/auth/register` - User registration

**POST** `/api/auth/login` - User login

**GET** `/api/auth/me` - Get user profile

Tasks
**GET** `/api/tasks` - Get all tasks

**POST** `/api/tasks` - Create task

**PUT** `/api/tasks/:id` - Update task

**DELETE** `/api/tasks/:id` - Delete task
