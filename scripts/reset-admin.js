import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = 'hoangninh2577@gmail.com';
  const password = 'Ninh20042577@#';

  console.log('--- ĐANG THỰC HIỆN RESET TÀI KHOẢN ADMIN ---');

  const passwordHash = await bcrypt.hash(password, 10);

  // Tìm kiếm tài khoản Admin hiện có
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  let updatedUser;
  if (existingAdmin) {
    console.log(`Đã tìm thấy tài khoản admin hiện tại (ID: ${existingAdmin.id}, Email: ${existingAdmin.email}).`);
    console.log('Tiến hành cập nhật Email và mật khẩu mới...');
    updatedUser = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email,
        passwordHash,
        fullName: 'Quan Tri Vien'
      }
    });
  } else {
    console.log('Không tìm thấy tài khoản admin nào trong hệ thống. Tiến hành tạo mới...');
    updatedUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: 'Quan Tri Vien',
        role: 'ADMIN'
      }
    });
  }

  console.log('✔ ĐÃ RESET THÀNH CÔNG!');
  console.log(`- Email đăng nhập: ${updatedUser.email}`);
  console.log(`- Mật khẩu mới: ${password}`);
  console.log(`- Vai trò: ${updatedUser.role}`);
}

main()
  .catch(err => {
    console.error('❌ Có lỗi xảy ra:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
