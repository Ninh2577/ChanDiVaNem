# KẾ HOẠCH TỔNG THỂ HOÀN THIỆN DỰ ÁN "CHÂN ĐI VÀ NẾM"

Dựa trên tình trạng hiện tại của dự án (kiến trúc Fullstack Vite + React + Express + Prisma đã hình thành, Database đã thiết lập, một số trang giao diện đã có), dưới đây là lộ trình chi tiết từng bước để đưa dự án đến vạch đích.

Kế hoạch này được thiết kế để **tối ưu hóa thời gian, tiết kiệm tài nguyên (token)** và **TUYỆT ĐỐI KHÔNG XÓA HOẶC SỬA CODE KHÔNG LIÊN QUAN** nếu chưa có sự đồng ý của bạn.

---

## Giai đoạn 1: Hoàn thiện Nền tảng & Xác thực (Ưu tiên Cao nhất - Làm ngay)
*Mục tiêu: Đảm bảo luồng bảo mật xuyên suốt để các tính năng khác có thể dựa vào.*

1. **Hoàn thiện luồng Đăng nhập / Đăng ký (Frontend + Backend):**
   - Kiểm tra API Login/Register. Đảm bảo token JWT được tạo đúng.
   - Frontend: Xử lý lưu JWT (localStorage) và gắn tự động vào các request (Fetch/Axios interceptor).
2. **Bảo vệ Routes (Route Guards):**
   - Phân quyền Frontend: Chặn người dùng chưa đăng nhập vào `/admin` hoặc `/ctv`.
   - Phân quyền Backend: Kiểm tra kỹ middleware `verifyAdmin`, `verifyCTV` trên các API nhạy cảm.

## Giai đoạn 2: Hoàn thiện CMS & Quản lý Doanh thu Quảng cáo (Ưu tiên Cao)
*Mục tiêu: Quản trị viên và Cộng tác viên phải có công cụ để quản lý toàn diện nội dung, giao diện và doanh thu quảng cáo.*

1. **Quản lý Bài viết & Trình soạn thảo (Rich Text Editor):**
   - Tích hợp `react-quill` để soạn thảo bài viết.
   - Xử lý API Upload Ảnh (Multer): Cho phép tải ảnh thumbnail và ảnh nhúng trong bài viết lên server.
2. **Quản lý Nội dung Động (CMS toàn diện cho Frontend):**
   - Mở rộng chức năng quản lý nội dung tĩnh (Site Content) cho **tất cả** các trang giao diện người dùng (không chỉ Trang chủ). Quản trị viên có thể thay đổi text, hình ảnh, cấu trúc giao diện cơ bản mà không cần can thiệp vào code, phục vụ việc thay đổi giao diện theo chiến dịch hoặc hợp đồng đối tác.
3. **Quản lý Popup & Banner Quảng cáo (Tính năng cốt lõi cho Doanh thu):**
   - Tạo module quản lý Popup/Banner độc lập trong Admin.
   - Các tính năng cấu hình mạnh mẽ:
     - Vị trí hiển thị (góc dưới màn hình, giữa trang, v.v...).
     - Thời gian hiển thị (thời lượng, thời điểm bắt đầu/kết thúc).
     - Hiển thị ngắt quãng, luân phiên (xen kẽ) giữa một hoặc nhiều chiến dịch quảng cáo.
   - Hiển thị popup mượt mà, tối ưu hóa UI/UX trên Frontend để không làm phiền độc giả nhưng vẫn đạt hiệu suất cao.
4. **Quản lý Doanh thu Quảng cáo:**
   - Xây dựng module thống kê doanh thu từ các hợp đồng/chiến dịch quảng cáo đã triển khai thông qua các Popup/Banner. Quản lý minh bạch và chi tiết theo từng chiến dịch.

## Giai đoạn 3: Kết nối Dữ liệu thực cho Giao diện Người dùng (Ưu tiên Trung bình)
*Mục tiêu: Xóa bỏ dữ liệu giả (mock data), đưa dữ liệu thật từ Database ra ngoài website.*

1. **Trang Chủ & Các Trang Con:**
   - Fetch danh sách "Điểm đến", "Đặc sản tiêu biểu", "Góc nhìn văn hóa" từ API.
   - Render nội dung động từ module CMS đã xây dựng ở Giai đoạn 2.
2. **Trang Chi tiết Bài viết (Post Detail):**
   - Hiển thị nội dung HTML động.
   - Làm tính năng Đếm lượt xem (View count).
   - Hiển thị Bài viết liên quan.
3. **Trang Tác giả (Author Profile):**
   - Thay thế mock data hiện tại trong `AuthorProfile.jsx` bằng API fetch danh sách bài viết của chính tác giả đó.

## Giai đoạn 4: Các tính năng Tương tác (Ưu tiên Trung bình - Thấp)
*Mục tiêu: Tăng trải nghiệm và sự gắn kết của độc giả.*

1. **Luồng Đăng ký Độc giả (Reader) Độc lập:**
   - Thiết kế trang và Form đăng ký **riêng biệt dành riêng cho độc giả** (Reader).
   - Tách biệt hoàn toàn với form ứng tuyển Cộng tác viên (CTV) để tránh chồng chéo tác nhân và dễ dàng quản lý tập người dùng.
2. **Hệ thống Bình luận (Comments):**
   - API thêm/sửa/xóa bình luận. (Hỗ trợ bình luận lồng nhau nếu cần).
   - UI hiển thị và viết bình luận ở cuối bài viết.
3. **Hệ thống Đánh giá (Rating) & Lưu bài viết (Save/Bookmark):**
   - Người dùng đăng nhập có thể đánh giá sao và lưu bài viết để đọc lại.
4. **Tìm kiếm (Search):**
   - Hoàn thiện Modal tìm kiếm, truy vấn bài viết theo từ khóa và hiển thị tại trang `SearchResults`.

## Giai đoạn 5: Tối ưu hóa & Chuẩn bị Triển khai (Giai đoạn Cuối)
*Mục tiêu: Đảm bảo code sạch, chuẩn SEO và sẵn sàng đưa lên server thực tế.*

1. **Tối ưu SEO:** Đẩy các trường `metaTitle`, `metaDesc` vào thẻ `<head>` của Frontend.
2. **Dọn dẹp code (Cleanup):**
   - Kiểm tra và gỡ bỏ toàn bộ `console.log`, code nháp. (Chỉ thực hiện khi có sự đồng ý của bạn).
3. **Kiểm tra Responsive:** Đảm bảo hiển thị tốt trên Mobile/Tablet, đặc biệt là các Popup Quảng cáo.

---

### 📌 Nguyên tắc làm việc tuân thủ nghiêm ngặt:
- **Tập trung:** Nhận yêu cầu ở module nào, chỉ mở và sửa đúng file của module đó.
- **An toàn:** Không tự ý xóa bỏ các component hoặc file đang có. Nếu có code cũ cần thay thế (như mock data), tôi sẽ ghi chú rõ ràng để bạn nắm được.
- **Tuần tự:** Bám sát lộ trình từ Giai đoạn 1 đến Giai đoạn 5.
