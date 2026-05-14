# CHÂN ĐI VÀ NẾM - Tài Liệu Dự Án

Đây là tài liệu wiki/cẩm nang dự án, cung cấp cái nhìn tổng quan về kiến trúc, cơ sở dữ liệu và danh sách các API Backend. File này nên được đọc đầu tiên trước khi triển khai phát triển tính năng mới.

---

## 1. Tổng Quan Kiến Trúc (Tech Stack)

Dự án này là một hệ thống CMS (Content Management System) / Blog nền tảng Web, được xây dựng theo kiến trúc Fullstack Monorepo đơn giản.

*   **Frontend**: React + Vite. Các trang nằm trong thư mục `src/pages`. Sử dụng `react-router-dom` để định tuyến và `react-quill` để tạo trình soạn thảo văn bản (Rich Text Editor).
*   **Backend**: Node.js + Express.js. Mã nguồn đặt tại thư mục `server/`.
*   **Database**: MySQL.
*   **ORM (Object-Relational Mapping)**: Prisma (`prisma/schema.prisma`).

---

## 2. Kiến trúc Cơ Sở Dữ Liệu (Database Schema)

Cơ sở dữ liệu bao gồm các bảng chính sau, được định nghĩa thông qua Prisma:

1.  **User**: Lưu trữ tài khoản.
    *   Có 3 vai trò (Role): `ADMIN`, `CTV` (Cộng tác viên/Tác giả), và `READER`.
2.  **Category**: Danh mục bài viết (Vd: Điểm Đến, Ẩm Thực). Quan hệ 1-Nhiều với bảng Post.
3.  **Tag**: Thẻ/Từ khóa bài viết. Quan hệ Nhiều-Nhiều với bảng Post.
4.  **Post**: Bảng trung tâm lưu trữ Bài viết.
    *   Mỗi bài có tiêu đề, slug, nội dung (HTML), tóm tắt, lượt xem.
    *   Có 2 cờ quan trọng: `isPublished` (Xuất bản/Bị khóa) và `isFeatured` (Nổi bật).
5.  **Comment**: Bình luận. Hỗ trợ bình luận lồng nhau (Nested comments) thông qua trường `parentId`.
6.  **Rating**: Đánh giá 1-5 sao. Ràng buộc mỗi user chỉ được rate 1 bài 1 lần.
7.  **NewsletterSubscriber**: Bảng lưu email khách hàng đăng ký nhận bản tin.

---

## 3. Danh sách REST API Backend

Backend cung cấp các API endpoints dưới đây. Base URL khi chạy cục bộ là `http://localhost:5000`.

### 3.1. Authentication (Xác thực) - `/api/auth`

| Method | Endpoint | Mô tả | Payload (Body) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới (Mặc định: READER) | `{ fullName, email, password }` |
| `POST` | `/api/auth/login` | Đăng nhập và nhận JWT Token | `{ email, password }` |

### 3.2. Posts (Bài viết) - `/api/posts`

| Method | Endpoint | Mô tả | Payload (Body) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Lấy danh sách tất cả bài viết | N/A |
| `GET` | `/api/posts/:slug` | Lấy chi tiết bài viết theo Slug | N/A |
| `POST` | `/api/posts` | Tạo bài viết mới | `{ title, content, categoryId }` |
| `PUT` | `/api/posts/:id` | Cập nhật thông tin bài viết | `{ title, content, categoryId, isPublished, isFeatured }` |
| `DELETE` | `/api/posts/:id` | Xóa bài viết vĩnh viễn | N/A |
| `PATCH` | `/api/posts/:id/toggle-lock` | Khóa/Mở khóa bài viết (Đổi trạng thái `isPublished`) | N/A |

---

## 4. Hướng dẫn Khởi chạy (Local Development)

### Cài đặt môi trường
Đảm bảo bạn đã cài đặt Node.js và MySQL.
1. Copy file `.env` mẫu hoặc tạo mới file `.env` tại thư mục gốc với nội dung:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/chandivanem_db"
   JWT_SECRET="chuoi_bao_mat_cua_ban"
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi tạo CSDL bằng Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Chạy ứng dụng
Dự án sử dụng `concurrently` để khởi chạy cả Frontend và Backend cùng lúc:
```bash
npm run dev
```
*   **Client (Vite)**: sẽ chạy tại cổng mặc định (thường là 5173).
*   **Server (Express)**: sẽ chạy tại cổng 5000.
