class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Đánh dấu đây là lỗi do nghiệp vụ (có thể lường trước)

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
