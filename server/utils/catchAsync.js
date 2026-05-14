// Hàm này sẽ bọc các hàm async/await trong Controller
// Giúp tự động bắt lỗi (catch) và truyền xuống middleware xử lý lỗi tổng, 
// loại bỏ việc phải viết try-catch lặp đi lặp lại.
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
