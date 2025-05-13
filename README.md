# Backend - Job Portal Project

## Overview
This backend service provides RESTful APIs for a job portal application. It manages job postings, companies, users, applications, and authentication.

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer for file uploads
- Cloudinary for image hosting
- Other utilities and middlewares

## Project Structure
- `models/` - Mongoose schemas for Job, User, Company, Application, etc.
- `controllers/` - Request handlers for various routes (job.controller.js, user.controller.js, etc.)
- `routes/` - Express route definitions for different resources
- `middlewares/` - Custom middlewares like authentication, file upload handling
- `utils/` - Utility functions for cloudinary, data URI conversion, database connection, etc.
- `index.js` - Entry point to start the Express server

## Setup and Installation
1. Clone the repository.
2. Navigate to the `Backend` directory.
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with necessary environment variables (e.g., MongoDB URI, JWT secret, Cloudinary credentials).
5. Start the server:
   ```
   npm start
   ```
6. The server runs on the configured port (default 5173).

## API Endpoints Overview
- **Auth Routes**: User registration, login, logout
- **User Routes**: User profile management
- **Company Routes**: Company creation, update, retrieval
- **Job Routes**: Create, update, delete, and fetch jobs with filtering support
- **Application Routes**: Apply for jobs, manage applications

Refer to the route files in `routes/` for detailed endpoint paths and HTTP methods.

## Testing
- Use Postman or similar tools to test API endpoints.
- Import `postman.json` collection for predefined requests.
- Ensure the backend server is running before testing.

## Notes
- Authentication is required for protected routes.
- File uploads are handled via Multer and stored on Cloudinary.
- Filtering on jobs supports location, job type, job mode, salary, and salary type.

## Additional Information
- Logging is implemented for key actions.
- Error handling middleware is used for consistent API error responses.
- CORS is configured to allow requests from the frontend.
- Environment variables are managed securely and should not be committed to version control.

## Contact
For any issues or contributions, please contact the project maintainer.

---
