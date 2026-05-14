import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Khởi tạo một Prisma Client duy nhất để sử dụng toàn cục
// Tránh việc mở quá nhiều kết nối đến Database trong quá trình dev
const prisma = new PrismaClient();

export default prisma;
