# Ademy

**Ademy** is a modern, full-stack Learning Management System (LMS) designed to revolutionize online education. Built with cutting-edge technologies, Ademy provides a seamless platform for students, teachers, and administrators to manage courses, track progress, and facilitate learning through an intuitive and responsive interface.

## 🚀 Features

### For Students
- **Course Enrollment & Management**: Browse, enroll, and manage courses with ease
- **Progress Tracking**: Monitor learning progress with detailed analytics
- **Interactive Learning**: Engage with course materials including videos, documents, and quizzes
- **Secure Payments**: Integrated Stripe payment gateway for course purchases
- **Google OAuth**: Quick and secure authentication via Google

### For Teachers
- **Course Creation**: Create and manage comprehensive courses with multimedia content
- **Student Management**: Track student enrollment and progress
- **Content Upload**: Upload videos, documents, and other learning materials via Cloudinary
- **Analytics Dashboard**: Monitor course performance and student engagement

### For Administrators
- **User Management**: Manage students, teachers, and their roles
- **Course Oversight**: Review and manage all courses on the platform
- **System Analytics**: Comprehensive dashboard for platform-wide insights
- **Role-Based Access Control**: Secure, role-based permissions system

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **Vite** - Lightning-fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Icons** - Comprehensive icon library
- **Axios** - HTTP client for API requests
- **@react-oauth/google** - Google OAuth integration
- **Moment.js** - Date and time manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication tokens
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing
- **Cloudinary** - Media management and CDN
- **Multer** - File upload handling
- **Express Validator** - Request validation
- **Google Auth Library** - Google OAuth verification

## 📁 Project Structure

```
Ademy/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── Components/    # React components
│   │   │   ├── Pages/    # Page components
│   │   │   ├── Admin/    # Admin-specific components
│   │   │   ├── Teacher/  # Teacher-specific components
│   │   │   └── Student/  # Student-specific components
│   │   ├── Utils/        # Utility functions and contexts
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Application entry point
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
├── server/               # Backend Node.js application
│   ├── src/
│   │   ├── Controllers/  # Request handlers
│   │   ├── Models/       # Database models
│   │   ├── Routes/       # API routes
│   │   ├── Middlewares/  # Custom middleware
│   │   ├── Utils/        # Utility functions
│   │   ├── db/          # Database configuration
│   │   └── app.js       # Express app configuration
│   ├── server.js        # Server entry point
│   └── package.json     # Backend dependencies
│
└── README.md            # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muhammad-abdullah11/Ademy.git
   cd Ademy
   ```

2. **Install dependencies**

   For the client:
   ```bash
   cd client
   npm install
   ```

   For the server:
   ```bash
   cd ../server
   npm install
   ```

3. **Environment Configuration**

   Create `.env` files in both `client` and `server` directories:

   **Client `.env`:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

   **Server `.env`:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the application**

   Start the backend server:
   ```bash
   cd server
   npm start
   ```

   Start the frontend development server (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🔐 Authentication & Authorization

Ademy implements a robust authentication system:
- **JWT-based authentication** for secure session management
- **Google OAuth 2.0** for social login
- **Role-based access control** (Student, Teacher, Admin)
- **Protected routes** with middleware validation
- **Secure password hashing** using bcrypt

## 💳 Payment Integration

- **Stripe** payment gateway integration
- Secure checkout process for course purchases
- Webhook support for payment confirmations
- Transaction history and receipts

## 📦 Database Schema

### User Model
- Authentication credentials
- Role assignment (student/teacher/admin)
- Profile information
- Enrolled courses

### Course Model
- Course details and metadata
- Instructor information
- Pricing and enrollment data
- Content references

### Enrollment Model
- Student-course relationships
- Progress tracking
- Payment status
- Completion certificates

## 🎨 UI/UX Excellence

- **Responsive Design**: Fully responsive across all devices
- **Modern Aesthetics**: Clean, professional interface with Tailwind CSS
- **Intuitive Navigation**: User-friendly routing and navigation
- **Accessibility**: WCAG compliant components
- **Performance Optimized**: Fast load times and smooth interactions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Teacher/Admin)
- `PUT /api/courses/:id` - Update course (Teacher/Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/student/:id` - Get student enrollments
- `PUT /api/enrollments/:id/progress` - Update progress

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform

### Backend (Heroku/Railway/Render)
1. Ensure all environment variables are configured
2. Deploy using your platform's CLI or Git integration
3. Set up MongoDB Atlas for production database

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Muhammad Abdullah**
- GitHub: [@muhammad-abdullah11](https://github.com/muhammad-abdullah11)

## 🙏 Acknowledgments

- React and Vite teams for excellent development tools
- MongoDB for robust database solutions
- Stripe for secure payment processing
- Cloudinary for media management
- All open-source contributors

---

**Built with ❤️ for the future of online education**
