# Frontend Guide: Accessing Our API

This guide will help you connect to and use our backend API in your frontend application.

## API Endpoints

Our API is located at `http://localhost:3001` (assuming you're running it locally). Here are the available endpoints:

### Authentication

1. **Signup**
   - URL: `/api/auth/signup`
   - Method: POST
   - Body: `{ "name": "Your Name", "email": "your@email.com", "password": "your_password", "role": "user" }`

2. **Login**
   - URL: `/api/auth/login`
   - Method: POST
   - Body: `{ "email": "your@email.com", "password": "your_password" }`

3. **Logout**
   - URL: `/api/auth/logout`
   - Method: POST

4. **Refresh Token**
   - URL: `/api/auth/refresh-token`
   - Method: POST

5. **Get User Info**
   - URL: `/api/auth/getinfo`
   - Method: GET
   - Headers: `Authorization: Bearer your_access_token_here`

### Protected Route

- URL: `/api/protected`
- Method: GET
- Headers: `Authorization: Bearer your_access_token_here`

