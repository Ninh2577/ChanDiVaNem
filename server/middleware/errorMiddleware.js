// Middleware xử lý lỗi tập trung
// Mọi lỗi văng ra từ hệ thống (kể cả lỗi database hay lỗi do dev ném ra) sẽ chảy về đây
export const globalErrorHandler = (err, req, res, _next) => {
  // Chuẩn hóa lỗi từ Prisma ORM sang lỗi có cấu trúc dễ đọc
  if (err.code === 'P2002') {
    err.statusCode = 409;
    err.message = `Dữ liệu bị trùng lặp: Trường dữ liệu (${err.meta?.target}) đã tồn tại trên hệ thống.`;
    err.isOperational = true;
  } else if (err.code === 'P2003') {
    err.statusCode = 400;
    err.message = 'Thao tác không thành công do vi phạm ràng buộc dữ liệu liên quan (Khóa ngoại).';
    err.isOperational = true;
  } else if (err.code === 'P2025') {
    err.statusCode = 404;
    err.message = 'Không tìm thấy bản ghi dữ liệu yêu cầu trên hệ thống.';
    err.isOperational = true;
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Chế độ DEV: Hiển thị toàn bộ stack trace để dễ debug
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } 
  // Chế độ PROD: Ẩn bớt các lỗi hệ thống để bảo mật
  else {
    // Nếu là lỗi định nghĩa từ trước (AppError)
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Các lỗi không lường trước (Lỗi thư viện, lỗi Prisma, v.v...)
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Có lỗi xảy ra từ máy chủ!'
      });
    }
  }
};
