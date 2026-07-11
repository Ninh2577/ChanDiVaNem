export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: result.error.flatten().fieldErrors,
    });
  }
  // Ghi đè req.body bằng dữ liệu đã được parse và sanitize bởi Zod
  req.body = result.data;
  next();
};
