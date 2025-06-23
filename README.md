# 👤 User Management System API

A backend RESTful API built with **Node.js**, **Express.js**, and **MongoDB** to manage user accounts. This project includes features like registration, login, JWT authentication (access & refresh tokens), and role-based authorization.

---

## 🚀 Features

- ✅ Register & Login with bcrypt password hashing
- 🔐 JWT Authentication (Access & Refresh Tokens)
- 🧾 Role-based Authorization (`admin`, `user`)
- 👤 Get all users (admin only)
- 🧾 Get current user info (/me)
- ❌ Logout with refreshToken deletion
- 🔄 Refresh accessToken via refreshToken
- 📦 Clean controller/service/model architecture

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (access + refresh)
- **Password Security:** Bcrypt
- **Utilities:** Dotenv, Morgan, CORS

---

## 📂 Project Structure

user_management_system/
├── node_modules/
├── src/
│   ├── config/         # Cấu hình kết nối DB, JWT, Cloudinary,...
│   ├── controllers/    # Xử lý logic cho các route (login, register,...)
│   ├── middleware/     # Auth, error handler, validator,...
│   ├── models/         # Mongoose schema (User, Token,...)
│   ├── routes/         # Định nghĩa API routes
│   ├── services/       # Tầng xử lý nghiệp vụ (xử lý login, lưu DB,...)
│   └── utils/          # Tiện ích chung (tạo error, tạo token,...)
├── app.js              # Cấu hình app Express (middlewares, routes,...)
├── server.js           # Điểm khởi động server
├── .env                # Biến môi trường (không push lên GitHub)
├── .gitignore          # Loại trừ node_modules, .env,...
├── package.json        # Thông tin và dependencies
├── package-lock.json   # Khoá phiên bản các thư viện
└── README.md           # Tài liệu mô tả dự án

---


---

## 📬 API Endpoints

| Method | Endpoint             | Description                     | Auth |
|--------|----------------------|----------------------------------|------|
| POST   | /api/register        | Register new user                | ❌   |
| POST   | /api/login           | Login and get tokens             | ❌   |
| GET    | /api/me              | Get current user info            | ✅   |
| GET    | /api/users           | Get list of users (admin only)   | ✅   |
| POST   | /api/refresh-token   | Refresh access token             | ❌   |
| POST   | /api/logout          | Logout and invalidate token      | ✅   |

---

## 🔐 JWT Authentication Flow

- `accessToken` expires in 15 minutes.
- `refreshToken` expires in 7 days and is stored in MongoDB.
- Users must send accessToken in `Authorization: Bearer <token>` header.

---

## 🧪 Setup & Run

```bash
# Clone the project
git clone https://github.com/CvMuong/user_management-system.git

# Install dependencies
cd user_management-system
npm install

# Copy .env file and configure
cp .env.example .env

# Run the server
npm run dev

--- 

PORT=5000
NODE_ENV =development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_SENDER=...
EMAIL_PASSWORD=...

--- 

## 🧪 Postman Collection

Bạn có thể tải file Postman tại đây:  
👉 [Tải xuống collection Postman](https://github.com/CvMuong/user_management-system/blob/master/docs/User_Management_System.postman_collection.json)





