# CHANGELOG - GIAI ĐOẠN 2: HOÀN THIỆN TÍNH NĂNG CÒN THIẾU

Tệp này ghi nhận toàn bộ các tính năng mới đã được phát triển và tích hợp vào hệ thống trong Giai đoạn 2.

---

## Các Thay Đổi Chi Tiết

### 1. Database & ORM Layer
* **Khôi phục mật khẩu:**
  * Tệp đã sửa: [schema.prisma](file:///d:/Duan/CHANDIVANEM/prisma/schema.prisma)
  * Chi tiết: Thêm hai trường `resetPasswordToken` (String?) và `resetPasswordExpires` (DateTime?) vào model `User` để hỗ trợ cơ chế xác thực đặt lại mật khẩu an toàn.

### 2. Tầng Nghiệp Vụ & API Backend (Express.js)
* **Phân trang & Bộ lọc động (Pagination & Dynamic Filters):**
  * Nâng cấp phân trang phía máy chủ cho:
    * **Danh sách bài viết:** `/api/posts?page=...&limit=...&categoryId=...&status=...` (lọc theo trạng thái và danh mục trực tiếp tại CSDL).
    * **Bình luận:** `/api/comments/post/:postId?page=...&limit=...` (phân trang bình luận gốc, các phản hồi replies tự động đi kèm comment gốc đó).
    * **Người dùng:** `/api/users?page=...&limit=...&role=...` (hỗ trợ Admin lọc danh sách tài khoản theo vai trò READER/CTV/ADMIN).
    * **Đơn ứng tuyển CTV:** `/api/applications?page=...&limit=...&status=...` (lọc đơn ứng tuyển theo trạng thái duyệt bài PENDING/APPROVED/REJECTED).
* **Quản trị Thẻ (Tag CRUD API):**
  * Tệp mới: [tagService.js](file:///d:/Duan/CHANDIVANEM/server/services/tagService.js), [tagController.js](file:///d:/Duan/CHANDIVANEM/server/controllers/tagController.js), [tagRoutes.js](file:///d:/Duan/CHANDIVANEM/server/routes/tagRoutes.js), [tagValidator.js](file:///d:/Duan/CHANDIVANEM/server/validators/tagValidator.js).
  * Chi tiết: Cung cấp API đầy đủ Thêm/Sửa/Xóa/Xem Tag. Tự động chuyển đổi tiếng Việt có dấu thành slug không dấu. Chỉ Admin mới được can thiệp chỉnh sửa dữ liệu Tag.
  * Cập nhật bài viết liên quan: Khi tạo/cập nhật post, hỗ trợ mảng `tagIds` liên kết Nhiều-Nhiều thông qua Prisma connect/set.
* **Đăng ký nhận Bản tin (Newsletter API):**
  * Tệp mới: [newsletterService.js](file:///d:/Duan/CHANDIVANEM/server/services/newsletterService.js), [newsletterController.js](file:///d:/Duan/CHANDIVANEM/server/controllers/newsletterController.js), [newsletterRoutes.js](file:///d:/Duan/CHANDIVANEM/server/routes/newsletterRoutes.js), [newsletterValidator.js](file:///d:/Duan/CHANDIVANEM/server/validators/newsletterValidator.js).
  * Chi tiết: Endpoint đăng ký `/api/newsletter/subscribe` và xem danh sách đăng ký `/api/newsletter` (chỉ dành cho Admin).
* **Quy trình Duyệt bài (Draft/Pending/Published workflow):**
  * Tại [postService.js](file:///d:/Duan/CHANDIVANEM/server/services/postService.js): 
    * Khi CTV tạo bài viết mới, hệ thống ép trạng thái `isPublished = false`.
    * CTV cập nhật bài viết không được thay đổi `isPublished`. Chỉ Admin mới được đổi trạng thái xuất bản bài viết thông qua API duyệt bài.
* **Đặt lại Mật khẩu (Forgot/Reset Password via Nodemailer):**
  * Tệp mới: [sendEmail.js](file:///d:/Duan/CHANDIVANEM/server/utils/sendEmail.js)
  * Chi tiết: Tích hợp thư viện `nodemailer` gửi thư khôi phục mật khẩu chứa token ngẫu nhiên mã hóa SHA-256 có thời hạn 1 giờ.

### 3. Giao Diện Người Dùng Frontend (React.js)
* **Component Phân trang dùng chung:**
  * Tệp mới: [Pagination.jsx](file:///d:/Duan/CHANDIVANEM/src/components/Pagination.jsx), [Pagination.css](file:///d:/Duan/CHANDIVANEM/src/components/Pagination.css).
  * Chi tiết: Component thiết kế theo tiêu chuẩn UI hiện đại với các hiệu ứng hover, hiển thị tối đa 5 nút trang và dấu chấm lửng khi danh sách dài.
* **Cập nhật phân trang các bảng Admin:**
  * Tại [AdminPosts.jsx](file:///d:/Duan/CHANDIVANEM/src/pages/AdminPosts.jsx) & [AdminUsers.jsx](file:///d:/Duan/CHANDIVANEM/src/pages/AdminUsers.jsx):
    * Đọc dữ liệu từ cấu trúc phản hồi API dạng `{ posts, pagination }` mới, nhúng các bộ chọn Dropdown lọc danh mục/trạng thái và hiển thị thanh phân trang.
* **Giao diện quản lý Tag mới:**
  * Tệp mới: [AdminTags.jsx](file:///d:/Duan/CHANDIVANEM/src/pages/AdminTags.jsx), [AdminTags.css](file:///d:/Duan/CHANDIVANEM/src/pages/AdminTags.css).
  * Chi tiết: Trang quản lý tag thiết kế giao diện cột đôi (danh sách bên trái, form thêm/sửa bên phải) trực quan, thuận tiện.
* **Giao diện Quên/Đặt lại Mật khẩu mới:**
  * Tệp mới: [ForgotPassword.jsx](file:///d:/Duan/CHANDIVANEM/src/pages/ForgotPassword.jsx), [ForgotPassword.css](file:///d:/Duan/CHANDIVANEM/src/pages/ForgotPassword.css), [ResetPassword.jsx](file:///d:/Duan/CHANDIVANEM/src/pages/ResetPassword.jsx), [ResetPassword.css](file:///d:/Duan/CHANDIVANEM/src/pages/ResetPassword.css).
  * Chi tiết: Trang nhập email gửi yêu cầu và trang đổi mật khẩu mới (kiểm tra mật khẩu tối thiểu 6 ký tự, so khớp mật khẩu gõ lại và hiển thị thông báo chuyển hướng đăng nhập).
* **Đám mây Tag chọn nhiều (Multi-select Tag Cloud) khi viết bài:**
  * Tại [CreatePost.jsx](file:///d:/Duan/CHANDIVANEM/src/pages/CreatePost.jsx): Thay thế ô nhập text đơn giản bằng một danh sách nhãn Tag chọn động (click để bật/tắt tag), hiển thị giao diện cực kỳ hiện đại.
* **Đăng ký Newsletter thực tế:**
  * Tại [NewsletterPage.jsx](file:///d:/Duan/CHANDIVANEM/src/pages/NewsletterPage.jsx): Kết nối Form đăng ký nhận bản tin với Backend API thực tế.

---

## Hướng Dẫn Kích Hoạt & Cài Đặt (Dành Cho Người Dùng)

Bạn vui lòng chạy các lệnh sau trong cửa sổ terminal của dự án để bắt đầu sử dụng các tính năng mới:

### Bước 1: Cài đặt thư viện email Nodemailer
```bash
npm install nodemailer
```

### Bước 2: Đồng bộ Cấu trúc Database mới
```bash
npx prisma generate
npx prisma migrate dev --name add_password_reset
```

### Bước 3: Cấu hình SMTP gửi mail trong file `.env`
Bạn mở tệp `.env` của mình và thêm cấu hình gửi email (Ví dụ sử dụng hộp thư ảo của Mailtrap hoặc Gmail SMTP):
```env
SMTP_HOST="sandbox.smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="tài_khoản_mailtrap_của_bạn"
SMTP_PASS="mật_khẩu_mailtrap_của_bạn"
```
*(Nếu không có SMTP_USER và SMTP_PASS, chức năng quên mật khẩu sẽ báo lỗi khi gửi thư nhưng không làm sập server).*
