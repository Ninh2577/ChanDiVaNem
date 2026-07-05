# BÁO CÁO TOÀN DIỆN DỰ ÁN: CHÂN ĐI VÀ NẾM
*Hệ thống Quản lý Nội dung (CMS) & Blog Du lịch - Ẩm thực - Di sản Việt Nam*

---

## 1. Giới Thiệu Chung về Dự Án
**Chân Đi Và Nếm** là một nền tảng Web Fullstack hoạt động theo mô hình CMS (Content Management System) kết hợp Blog chuyên sâu về văn hóa, ẩm thực, địa danh và phong cảnh Việt Nam. Mục tiêu của dự án là gìn giữ, tôn vinh và quảng bá các giá trị di sản hữu hình và vô hình của Việt Nam thông qua những bài viết nghệ thuật chất lượng cao, hình ảnh sống động và trải nghiệm trực quan.

Hệ thống được thiết kế tối ưu hóa cho 3 nhóm đối tượng:
1. **Độc giả (Reader)**: Tìm đọc nội dung du lịch, văn hóa, ẩm thực, lưu trữ các bài viết yêu thích, bình luận và đánh giá bài viết.
2. **Cộng tác viên (CTV/Tác giả)**: Viết và biên tập bài viết bằng trình soạn thảo Rich Text, quản lý bài viết cá nhân và gửi yêu cầu phê duyệt đến quản trị viên.
3. **Quản trị viên (Admin)**: Quản lý toàn bộ bài viết, kiểm duyệt nội dung, quản lý người dùng và cấp quyền, tùy chỉnh sơ đồ menu điều hướng động, thiết lập nội dung tĩnh (CMS các trang About/Homepage), và quản lý các chiến dịch quảng cáo (Ad Campaigns) kèm thống kê doanh thu/click chuột.

---

## 2. Kiến Trúc Hệ Thống & Công Nghệ Sử Dụng

Dự án áp dụng mô hình **Monorepo** kết hợp giữa Frontend và Backend trong cùng một kho lưu trữ mã nguồn để thuận tiện cho việc phát triển và triển khai.

### 2.1. Sơ đồ Kiến trúc Công nghệ (Tech Stack)

```mermaid
graph TD
    subgraph Client [Frontend - React + Vite]
        ReactApp[React JS 19] --> Router[React Router DOM v7]
        ReactApp --> Editor[React Quill New Editor]
        ReactApp --> Charts[Recharts Visualization]
        ReactApp --> DndKit[dnd-kit Drag & Drop]
    end

    subgraph Server [Backend - Node.js + Express.js]
        Express[Express Framework] --> AuthMW[Authentication Middleware JWT]
        Express --> UploadMW[Multer Image Upload]
        Express --> Prisma[Prisma ORM]
    end

    subgraph Database [Storage]
        Prisma --> MySQL[(MySQL Database)]
        UploadMW --> UploadFolder[Local File System '/uploads']
    end

    Client -- REST API / CORS --> Server
```

### 2.2. Chi tiết Công nghệ & Thư viện Chính

| Thành phần | Công nghệ / Thư viện | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Frontend Core** | React JS 19 + Vite | Khung giao diện ứng dụng (SPA), biên dịch siêu tốc nhờ Vite HMR. |
| **Routing** | React Router DOM v7 | Quản lý định tuyến trang, chia phân quyền Route công khai/bảo mật. |
| **Styling** | Vanilla CSS | Tối ưu tính tùy biến cao, phong cách thiết kế hiện đại, responsive. |
| **Rich Text Editor**| `react-quill-new` | Trình soạn thảo WYSIWYG chuyên nghiệp cho CTV và Admin viết bài. |
| **Thống kê / Biểu đồ**| `recharts` | Biểu diễn lưu lượng truy cập (views) và tỷ lệ chuyên mục trực quan tại Admin Dashboard. |
| **Kéo thả (Drag-drop)**| `dnd-kit` | Hỗ trợ sắp xếp thứ tự Menu động (Navigation Items) trong trang quản trị. |
| **Backend Core** | Express.js (Node.js) | Xây dựng RESTful API xử lý logic nghiệp vụ. |
| **ORM** | Prisma | Tương tác CSDL trực quan, quản lý database migration dễ dàng. |
| **CSDL** | MySQL | Hệ quản trị cơ sở dữ liệu quan hệ lưu trữ thông tin hệ thống. |
| **Bảo mật & Auth** | `bcrypt`, `jsonwebtoken` | Mã hóa mật khẩu người dùng và xác thực phiên đăng nhập bằng JWT. |
| **Xử lý Files** | `multer` | Quản lý việc tải lên (upload) hình ảnh bài viết và banner quảng cáo. |

---

## 3. Thiết Kế Cơ Sở Dữ Liệu (Database Schema)

CSDL được thiết kế chuẩn hóa và triển khai thông qua Prisma ORM (`prisma/schema.prisma`), liên kết chặt chẽ các đối tượng trong hệ thống.

```mermaid
erDiagram
    USER ||--o{ POST : "creates"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ RATING : "gives"
    USER }o--o{ POST : "saved_posts (UserSavedPosts)"
    
    CATEGORY ||--o{ POST : "contains"
    CATEGORY ||--o{ CATEGORY : "parent-sub (SubCategories)"
    
    TAG }o--o{ POST : "belongs_to (Many-to-Many)"
    
    POST ||--o{ COMMENT : "has"
    POST ||--o{ RATING : "has"
    
    COMMENT ||--o{ COMMENT : "parent-reply (CommentReplies)"
    
    NAVIGATION_ITEM ||--o{ NAVIGATION_ITEM : "submenu (SubMenu)"
    
    CONTRIBUTOR_APPLICATION {
        int id
        string fullName
        string phone
        string email
        string portfolioLink
        string favoriteCategory
        string experience
        string status
    }
    
    AD_CAMPAIGN {
        int id
        string title
        string imageUrl
        string targetUrl
        string position
        datetime startDate
        datetime endDate
        int viewCount
        int clickCount
        float contractValue
        int displayInterval
        boolean isActive
    }

    SITE_CONTENT {
        string key
        string value
    }
```

### Chi tiết các Bảng CSDL

1. **User (Người dùng)**:
   * `id`: Khóa chính (Tự tăng).
   * `email` (Unique): Địa chỉ email đăng nhập.
   * `passwordHash`: Mật khẩu băm Bcrypt.
   * `fullName`: Tên đầy đủ.
   * `role`: Phân quyền người dùng (`ADMIN`, `CTV`, `READER`). Mặc định là `READER`.
   * `avatarUrl`, `bio`: Ảnh đại diện và giới thiệu ngắn về tác giả.
2. **Category (Danh mục)**:
   * Hỗ trợ cấu trúc đa cấp (Cha-Con) thông qua mối quan hệ tự tham chiếu `parentId` liên kết đến bảng Category.
3. **Tag (Thẻ từ khóa)**:
   * Mối quan hệ Nhiều-Nhiều (`Many-to-Many`) với bảng `Post` nhằm hỗ trợ phân loại linh động.
4. **Post (Bài viết)**:
   * Chứa nội dung dạng LongText lưu mã HTML biên tập từ Quill Editor.
   * Chứa các trường phục vụ SEO: `metaTitle`, `metaDesc`, `canonicalUrl`, và `thumbnailAlt`.
   * Trạng thái quản lý: `isFeatured` (Bài viết nổi bật), `isPublished` (Xuất bản / Ẩn khóa).
   * Lượt xem bài viết (`viewCount`).
5. **Comment (Bình luận)**:
   * Hỗ trợ bình luận lồng nhau đa cấp (Nested/Reply) bằng liên kết tự tham chiếu `parentId` trỏ về Comment gốc.
6. **Rating (Đánh giá)**:
   * Ràng buộc duy nhất `@@unique([userId, postId])` đảm bảo mỗi độc giả chỉ được chấm điểm (1 đến 5 sao) cho một bài viết một lần duy nhất.
7. **NewsletterSubscriber (Đăng ký Bản tin)**:
   * Lưu trữ các email đăng ký để nhận thông tin cập nhật mới nhất.
8. **ContributorApplication (Đơn Ứng Tuyển CTV)**:
   * Đơn xin đăng ký làm CTV từ người dùng với trạng thái `PENDING`, `APPROVED`, hoặc `REJECTED`.
9. **NavigationItem (Menu Điều hướng)**:
   * Lưu trữ sơ đồ thanh Menu động cho Header. Cho phép sắp xếp thứ tự (`order`), trạng thái (`isActive`), và hỗ trợ Menu 2 cấp (Cha-Con).
10. **SiteContent (Nội dung tĩnh)**:
    * Lưu cấu hình động dạng JSON (ví dụ nội dung trang About, cấu trúc hiển thị trang chủ) dưới dạng khóa-giá trị (`key` - `value`).
11. **AdCampaign (Chiến dịch quảng cáo)**:
    * Quản lý các Banner/Popup quảng cáo trên trang với các vị trí hiển thị đa dạng, đo lường lượt xem (`viewCount`), lượt click (`clickCount`), doanh thu (`contractValue`), ngày bắt đầu và kết thúc.

---

## 4. Bản Đồ Tính Năng Hệ Thống (Feature Matrix)

Hệ thống được phát triển các phân hệ nghiệp vụ tương thích với vai trò của từng tài khoản.

### 4.1. Giao Diện Người Dùng & Độc Giả (Client Site)
* **Trang chủ (Home)**: Hiển thị Hero banner, các bài viết nổi bật (Featured Posts), bài viết mới nhất phân nhóm theo các mục Ẩm thực, Điểm đến, Văn hóa. Banner quảng cáo chạy tự động.
* **Trang chuyên mục (Culture, Destinations, Cuisine)**: Phân loại bài viết theo chủ đề cụ thể, lọc nội dung.
* **Đọc bài viết chi tiết (Post Detail)**: Hiển thị giao diện bài viết chuẩn SEO, tích hợp chức năng:
  * Đánh giá chất lượng bài viết (Rating 1-5 sao).
  * Viết bình luận và trả lời bình luận của độc giả khác (Nested Comments).
  * Đánh dấu lưu trữ bài viết để xem lại sau (Saved Posts).
* **Đăng ký Newsletter**: Form đăng ký email nhanh gọn ở phần Footer và trang chuyên biệt giúp tăng tương tác của độc giả.
* **Đăng ký Cộng tác viên**: Độc giả có thể điền đơn ứng tuyển CTV, cung cấp liên kết Portfolio và kinh nghiệm viết lách để gửi lên Ban quản trị.
* **Tìm kiếm nâng cao**: Thanh tìm kiếm trực quan trên Header hỗ trợ tìm kiếm bài viết theo từ khóa tiêu đề hoặc tóm tắt.

### 4.2. Giao Diện Cộng Tác Viên (CTV Panel)
* **Dashboard CTV**: Hiển thị nhanh số lượng bài viết cá nhân đã đăng, tổng số lượt xem bài viết của mình, và biểu đồ hiệu suất.
* **Viết bài mới (Create/Edit Post)**: Soạn thảo bài viết chất lượng cao với định dạng ảnh chèn trực tiếp, tự tùy biến tiêu đề meta SEO để tối ưu hóa hiển thị công cụ tìm kiếm.
* **Quản lý bài viết cá nhân**: Theo dõi danh sách bài viết tự tay viết, trạng thái duyệt (Đã xuất bản / Chưa xuất bản / Bị khóa bởi Admin).
* **Quản lý trang cá nhân**: Cập nhật Bio, ảnh đại diện, số điện thoại hiển thị trên trang Profile công khai của Tác giả.

### 4.3. Giao Diện Quản Trị (Admin Panel)
* **Admin Dashboard**: Thống kê số lượng lượt xem trong 7 ngày gần nhất qua biểu đồ đường (Line Chart), thống kê tỷ trọng chuyên mục qua biểu đồ tròn (Pie Chart), và các thẻ thông tin nhanh (Views, Active Posts, Subscribers, Feedbacks).
* **Quản lý Bài viết (Admin Posts)**: Quản lý toàn bộ bài viết trên hệ thống. Admin có quyền khóa/mở khóa bài viết (`isPublished`), cài đặt làm bài viết nổi bật (`isFeatured`) hoặc xóa vĩnh viễn bài viết vi phạm.
* **Quản lý Người dùng (Admin Users)**: Xem danh sách thành viên, thực hiện đổi phân quyền (Reader thành CTV hoặc Admin) và xóa bỏ tài khoản.
* **Quản lý Danh mục (Admin Categories)**: CRUD danh mục chính và danh mục con đa cấp phục vụ phân loại bài viết.
* **Quản lý Menu điều hướng (Admin Navigation)**: Sử dụng thư viện kéo thả `dnd-kit` để điều chỉnh thứ tự hiển thị, thêm mới liên kết menu, kích hoạt/vô hiệu hóa các mục trên thanh Header.
* **Cấu hình CMS Nội dung tĩnh (Admin Site Content)**: Chỉnh sửa trực tiếp thông tin giới thiệu thương hiệu, câu chuyện, sứ mệnh, tầm nhìn, ảnh minh họa cho trang giới thiệu (About) mà không cần can thiệp mã nguồn.
* **Quản trị Quảng cáo (Admin Ads)**: Tạo lập các chiến dịch quảng cáo biểu ngữ banner hoặc popup, cài đặt tỷ lệ thời gian hiển thị chậm, đo lường các chỉ số hiệu quả kinh doanh (CTR - Click Through Rate, Doanh thu hợp đồng quảng cáo).

---

## 5. Danh Sách Endpoint REST API Backend
Mọi yêu cầu từ Frontend đều được ánh xạ về Backend thông qua Base URL: `http://localhost:5000/api`

### 5.1. Xác thực & Tài khoản (`/api/auth`)
* `POST /register`: Đăng ký tài khoản (mặc định là READER).
* `POST /login`: Đăng nhập, trả về thông tin user và JWT Token.

### 5.2. Quản lý Bài viết (`/api/posts`)
* `GET /`: Lấy toàn bộ bài viết (có bộ lọc).
* `GET /published`: Lấy danh sách bài viết đã xuất bản công khai.
* `GET /detail/:id`: Lấy chi tiết bài viết theo ID.
* `GET /:slug`: Lấy chi tiết bài viết theo Slug phục vụ SEO URL.
* `POST /` (Yêu cầu quyền CTV/Admin): Tạo bài viết mới.
* `PUT /:id` (Yêu cầu quyền CTV/Admin): Cập nhật bài viết.
* `DELETE /:id` (Yêu cầu quyền Admin): Xóa bài viết vĩnh viễn.
* `PATCH /:id/toggle-lock` (Yêu cầu quyền Admin): Khóa hoặc mở khóa xuất bản bài viết.

### 5.3. Quản lý Chuyên mục (`/api/categories`)
* `GET /`: Lấy danh sách tất cả các danh mục.
* `POST /` (Yêu cầu quyền Admin): Tạo mới danh mục.
* `PUT /:id` (Yêu cầu quyền Admin): Cập nhật thông tin danh mục.
* `DELETE /:id` (Yêu cầu quyền Admin): Xóa danh mục.

### 5.4. Đơn Ứng Tuyển CTV (`/api/applications`)
* `POST /`: Độc giả gửi đơn đăng ký làm CTV.
* `GET /` (Yêu cầu quyền Admin): Admin lấy danh sách các đơn đã nộp.
* `PATCH /:id/status` (Yêu cầu quyền Admin): Duyệt/Từ chối đơn ứng tuyển.

### 5.5. Quản trị Menu Điều Hướng (`/api/navigation`)
* `GET /`: Lấy sơ đồ menu hiện tại đang hoạt động.
* `PUT /` (Yêu cầu quyền Admin): Cập nhật cấu trúc menu.
* `POST /root` (Yêu cầu quyền Admin): Thêm một menu gốc mới.
* `POST /reorder` (Yêu cầu quyền Admin): Lưu lại thứ tự menu sau khi kéo thả.
* `POST /:parentId/children` (Yêu cầu quyền Admin): Thêm menu con cấp 2.
* `PATCH /:id` (Yêu cầu quyền Admin): Thay đổi thông tin menu.
* `DELETE /:id` (Yêu cầu quyền Admin): Xóa bỏ mục menu.

### 5.6. Quản trị Chiến Dịch Quảng Cáo (`/api/ads`)
* `GET /active`: Lấy các quảng cáo đang chạy theo thời gian thực (được lọc theo ngày hiện tại và trạng thái kích hoạt).
* `POST /:id/view`: Tăng biến đếm lượt xem quảng cáo thêm 1 đơn vị.
* `POST /:id/click`: Tăng biến đếm lượt nhấp chuột quảng cáo thêm 1 đơn vị.
* `GET /` (Yêu cầu quyền Admin): Lấy toàn bộ danh sách chiến dịch quảng cáo.
* `POST /` (Yêu cầu quyền Admin): Tạo mới chiến dịch quảng cáo.
* `PUT /:id` (Yêu cầu quyền Admin): Cập nhật chiến dịch.
* `DELETE /:id` (Yêu cầu quyền Admin): Xóa chiến dịch quảng cáo.

### 5.7. Quản lý File Ảnh (`/api/upload`)
* `POST /` (Yêu cầu đăng nhập): Nhận file ảnh qua multipart/form-data bằng Multer, lưu trữ trong thư mục `/server/uploads` và trả về URL ảnh công khai `/uploads/filename`.

---

## 6. Cấu Trúc Mã Nguồn (Directory Layout)

Cấu trúc monorepo phân chia rõ ràng trách nhiệm của Client và Server.

```text
CHANDIVANEM/
├── prisma/                  # Quản lý CSDL thông qua Prisma ORM
│   ├── schema.prisma        # Sơ đồ thiết kế các bảng CSDL
│   ├── seed.js              # File dữ liệu mẫu khởi tạo hệ thống
│   ├── seedNavigation.js    # Khởi tạo dữ liệu Menu động
│   └── seedSiteContent.js   # Khởi tạo nội dung mẫu trang giới thiệu
├── public/                  # Các file tĩnh phân phối trực tiếp ở Frontend
├── server/                  # Mã nguồn Backend (Express.js)
│   ├── config/              # Khởi tạo kết nối (Prisma client)
│   ├── controllers/         # Bộ điều hướng logic nghiệp vụ API
│   ├── middleware/          # Các bộ lọc trung gian (Auth, Error handling)
│   ├── routes/              # Khai báo định tuyến endpoint API
│   ├── services/            # Tách biệt logic nghiệp vụ phức tạp (nếu có)
│   ├── uploads/             # Thư mục lưu trữ hình ảnh tải lên thực tế
│   ├── utils/               # Các hàm tiện ích, định nghĩa lỗi AppError
│   ├── app.js               # Cấu hình Express app & Middlewares
│   └── server.js            # Khởi chạy lắng nghe cổng server (Port 5000)
├── src/                     # Mã nguồn Frontend (React.js)
│   ├── assets/              # Tài nguyên hình ảnh, font cục bộ
│   ├── components/          # Các component React tái sử dụng (Header, Footer, Layouts)
│   ├── pages/               # Các trang giao diện chính (Home, PostDetail, Admin panels)
│   ├── utils/               # Tiện ích Frontend (gọi API có kèm JWT Token)
│   ├── App.css              # Style chung của ứng dụng
│   ├── App.jsx              # Tệp cấu hình phân định tuyến Client
│   ├── index.css            # Định nghĩa các biến Color Palette & Typography
│   └── main.jsx             # Tệp đầu vào khởi chạy React app
├── vite.config.js           # Cấu hình Vite bundler
├── package.json             # Danh sách thư viện và script khởi chạy dự án
└── PROJECT_DOCUMENTATION.md # Tài liệu hướng dẫn phát triển gốc
```

---

## 7. Hướng Dẫn Cài Đặt & Khởi Chạy Nhanh (Local Setup)

### Bước 1: Chuẩn bị môi trường
* Đảm bảo máy tính đã cài đặt **Node.js** (khuyến nghị phiên bản LTS >= 18.x) và **MySQL Server**.

### Bước 2: Tạo Cơ sở Dữ liệu
* Tạo một database trống trong MySQL, ví dụ đặt tên là `chandivanem_db`.

### Bước 3: Cấu hình file Môi trường (`.env`)
* Tạo file `.env` tại thư mục gốc của dự án với nội dung cấu hình kết nối MySQL và khóa bảo mật JWT:
  ```env
  DATABASE_URL="mysql://username:password@localhost:3306/chandivanem_db"
  JWT_SECRET="chuoi_ma_khoa_bao_mat_tuy_y_chon"
  ```
  *(Thay thế `username` và `password` theo cấu hình MySQL cục bộ của bạn)*.

### Bước 4: Cài đặt thư viện & Đồng bộ Database
* Chạy lệnh cài đặt các gói thư viện cho cả Client và Server:
  ```bash
  npm install
  ```
* Thực hiện tạo bảng trong MySQL thông qua Prisma:
  ```bash
  npx prisma generate
  npx prisma db push
  ```
* Nạp dữ liệu mẫu ban đầu để chạy thử nghiệm các tính năng của Admin/Trang chủ:
  ```bash
  node prisma/seed.js
  ```

### Bước 5: Khởi chạy dự án ở chế độ Development
* Khởi động song song cả Frontend và Backend bằng lệnh tích hợp:
  ```bash
  npm run dev
  ```
* Trình duyệt sẽ tự động mở trang chủ Frontend tại địa chỉ: `http://localhost:5173` (hoặc cổng rảnh tiếp theo).
* Backend API hoạt động tại: `http://localhost:5000`.

---

## 8. Các Tính Năng Điểm Nhấn & Định Hướng Phát Triển

### 8.1. Các điểm sáng kỹ thuật trong dự án
1. **Hệ thống Menu động nâng cao**: Thay vì viết cứng (hardcode) các liên kết điều hướng, Admin có thể dễ dàng thay đổi cấu trúc menu Header ngay trên UI, hỗ trợ phân cấp 2 tầng và cập nhật trực tiếp xuống Database.
2. **Theo dõi Hiệu năng Quảng cáo (Ad Tracking)**: Cơ chế thu thập số liệu lượt hiển thị và nhấp chuột tự động tích hợp ngầm ở Client giúp người quản trị dễ dàng tính toán ROI (tỷ suất lợi nhuận) cho đối tác quảng cáo của blog.
3. **CMS Nội dung tĩnh linh hoạt**: Toàn bộ nội dung trang giới thiệu (About) đều được lưu trữ dưới dạng JSON, giúp quản trị viên có thể đổi ảnh, sửa tiêu đề, đổi nội dung thương hiệu mà không cần nhờ đến lập trình viên sửa code.

### 8.2. Định hướng mở rộng tương lai
* **Tích hợp bộ nhớ đệm (Caching)**: Sử dụng Redis ở Backend để lưu các bài viết nhiều lượt xem hoặc sơ đồ menu động, giảm tải tối đa cho MySQL.
* **Tối ưu hóa SEO nâng cao**: Áp dụng Server-Side Rendering (SSR) bằng Next.js thay thế cho Single Page Application (SPA) hiện tại để bot tìm kiếm Google cào bài viết tốt hơn.
* **Quản trị Bình luận thông minh**: Bổ sung bộ lọc từ cấm, tự động ẩn bình luận chứa từ ngữ thô tục hoặc spam quảng cáo bằng AI đơn giản.
