# GIAI ĐOẠN 3 — DỌN DẸP KỸ THUẬT & TỐI ƯU
**Thời gian ước tính:** ~1 tuần
**Điều kiện tiên quyết:** Hoàn thành Giai đoạn 1 và 2.

---

## Task 3.1 — Soft Delete cho Post và Comment

**Schema — `prisma/schema.prisma`:**
```prisma
model Post {
  ...
  deletedAt DateTime?
}

model Comment {
  ...
  deletedAt DateTime?
}
```
Chạy `npx prisma migrate dev --name add_soft_delete`

**Backend — `postService.js`:**
```js
export const deletePost = async (id) => {
  return prisma.post.update({ where: { id: Number(id) }, data: { deletedAt: new Date() } });
};

// Sửa MỌI query lấy danh sách/chi tiết post để loại trừ đã xóa:
where: { deletedAt: null, ...otherFilters }
```
**QUAN TRỌNG:** Rà soát toàn bộ nơi dùng `prisma.post.findMany`/`findUnique`/`findFirst` (dùng `grep -rn "prisma.post.find" server/`) để thêm điều kiện `deletedAt: null`, tránh việc bài đã "xóa mềm" vẫn hiển thị ở nơi khác bị bỏ sót.

Thêm endpoint riêng cho Admin: `GET /api/posts/trash` (xem bài đã xóa mềm) và `PATCH /api/posts/:id/restore` (khôi phục), `DELETE /api/posts/:id/permanent` (xóa vĩnh viễn thật sự — chỉ Admin).

Áp dụng pattern tương tự cho Comment (xóa mềm thay vì xóa cứng, giữ nguyên logic cascade xóa reply con — nhưng giờ là set `deletedAt` cho cả comment cha và replies).

**Frontend:**
- Admin thêm tab "Thùng rác" hiển thị bài đã xóa mềm, nút Khôi phục / Xóa vĩnh viễn.

---

## Task 3.2 — Dọn ảnh mồ côi (orphaned images)

**Vấn đề:** Khi xóa bài viết hoặc đổi ảnh đại diện, file ảnh cũ trong `server/uploads` không bị xóa theo.

**Backend — tạo utility mới `server/utils/fileCleanup.js`:**
```js
import fs from 'fs/promises';
import path from 'path';

export const deleteUploadedFile = async (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
  const filePath = path.join(process.cwd(), 'server', imageUrl);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.warn(`Không thể xóa file ${filePath}:`, err.message);
  }
};
```

**Áp dụng trong `postService.js`:**
- `updatePost`: nếu `imageUrl` mới khác `imageUrl` cũ trong DB → gọi `deleteUploadedFile(oldImageUrl)` sau khi update thành công.
- `deletePost` (xóa vĩnh viễn thật, không phải soft delete): gọi `deleteUploadedFile(post.imageUrl)`.

**Viết thêm 1 script bảo trì** `server/scripts/cleanOrphanImages.js` (chạy thủ công định kỳ, không tự động):
- Liệt kê tất cả file trong `server/uploads`
- So sánh với toàn bộ `imageUrl` đang được tham chiếu trong DB (Post, User.avatarUrl, AdCampaign.imageUrl, SiteContent...)
- File nào không được tham chiếu → log ra danh sách (KHÔNG tự động xóa, để Admin xem lại và xác nhận thủ công lần đầu tránh xóa nhầm).

---

## Task 3.3 — Full-Text Search thay vì LIKE

**Vấn đề:** `searchPosts(q)` hiện dùng `LIKE '%keyword%'`, chậm khi dữ liệu lớn, không hỗ trợ tìm gần đúng/xếp hạng độ liên quan.

**Cách làm (MySQL Full-Text Index, không cần thêm hạ tầng mới):**

1. Thêm Full-Text Index vào schema (Prisma hỗ trợ raw SQL cho việc này qua migration thủ công vì Prisma chưa hỗ trợ native `FULLTEXT` trực tiếp trong schema):
```sql
-- Thêm vào file migration sau khi `npx prisma migrate dev --create-only --name add_fulltext_index`
ALTER TABLE Post ADD FULLTEXT INDEX post_fulltext_idx (title, excerpt, content);
```
Sau đó chạy `npx prisma migrate deploy` hoặc tiếp tục `migrate dev` để áp dụng.

2. Sửa `postService.js` dùng raw query cho search:
```js
export const searchPosts = async (q) => {
  if (!q || !q.trim()) return [];
  const keyword = q.trim();
  const posts = await prisma.$queryRaw`
    SELECT id, title, slug, excerpt, imageUrl, createdAt,
      MATCH(title, excerpt, content) AGAINST(${keyword} IN NATURAL LANGUAGE MODE) AS relevance
    FROM Post
    WHERE MATCH(title, excerpt, content) AGAINST(${keyword} IN NATURAL LANGUAGE MODE)
      AND isPublished = 1 AND deletedAt IS NULL
    ORDER BY relevance DESC
    LIMIT 20
  `;
  return posts;
};
```
**Lưu ý:** Full-Text Search tiếng Việt có dấu trên MySQL có hạn chế nhất định (tách từ theo khoảng trắng, không hiểu ngữ nghĩa). Nếu kết quả không tốt, cân nhắc để lại ghi chú "cần đánh giá Elasticsearch/MeiliSearch nếu tìm kiếm là tính năng cốt lõi" thay vì cố tối ưu sâu ở giai đoạn này.

**Kiểm tra:** so sánh thời gian phản hồi trước/sau với tập dữ liệu giả lập ≥ 1000 bài viết (dùng seed script để tạo dữ liệu test).

---

## Task 3.4 — Chuẩn hóa Error Handling (rà soát lại toàn diện)

Đây là bước rà soát lại Task 1.10 một cách kỹ hơn sau khi đã có nhiều tính năng mới ở Giai đoạn 2:

1. Đảm bảo class `AppError` (trong `server/utils/`) được dùng nhất quán ở MỌI service, không còn chỗ nào `throw new Error(...)` thô (dùng `grep -rn "throw new Error(" server/` để rà soát, thay bằng `AppError`).
2. Đảm bảo `catchAsync` bọc TẤT CẢ controller (rà soát bằng cách kiểm tra từng file trong `server/controllers/`).
3. Kiểm tra log lỗi: dùng thư viện logging đơn giản (VD `winston` hoặc `pino`) thay vì `console.error` thô, để sau này dễ theo dõi ở production (log ra file hoặc dịch vụ ngoài).
4. Thêm xử lý cho lỗi `PayloadTooLargeError` (khi upload file vượt giới hạn Multer) — trả về message rõ ràng "File vượt quá dung lượng cho phép (5MB)" thay vì lỗi 500 mặc định.

---

## Checklist hoàn thành Giai đoạn 3
- [ ] 3.1 Soft delete cho Post/Comment hoạt động, có trang Thùng rác cho Admin
- [ ] 3.2 Ảnh cũ được dọn khi update/xóa, có script rà soát ảnh mồ côi
- [ ] 3.3 Tìm kiếm dùng Full-Text Index, có so sánh hiệu năng trước/sau
- [ ] 3.4 Toàn bộ lỗi được xử lý nhất quán qua AppError + catchAsync, có logging tử tế
- [ ] Test hồi quy (regression test) toàn bộ tính năng đã làm ở Giai đoạn 1 và 2 vẫn hoạt động đúng
