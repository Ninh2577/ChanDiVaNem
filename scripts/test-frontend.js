import fs from 'fs';
import path from 'path';

// ANSI màu sắc cho log
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const SRC_DIR = 'd:/Duan/CHANDIVANEM/src';

// Helper đệ quy để quét tất cả các file trong thư mục
function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFilesRecursively(name, fileList);
    } else {
      if (name.endsWith('.js') || name.endsWith('.jsx') || name.endsWith('.css')) {
        fileList.push(name);
      }
    }
  }
  return fileList;
}

function verifyImportsAndPaths() {
  console.log(`\n${colors.bold}${colors.cyan}--- PHẦN D: KIỂM TRA TĨNH FRONTEND & RÀ SOÁT IMPORTS ---${colors.reset}`);
  
  const allFiles = getFilesRecursively(SRC_DIR);
  console.log(`Đã phát hiện tổng số ${allFiles.length} file mã nguồn trong thư mục /src.`);

  let brokenImportsCount = 0;
  let syntaxIssuesCount = 0;

  for (const filePath of allFiles) {
    const relativePath = path.relative('d:/Duan/CHANDIVANEM', filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Quét lỗi import cục bộ (local imports)
    // Regex tìm kiếm các câu lệnh import từ đường dẫn tương đối (./ hoặc ../)
    const importRegex = /import\s+[\s\S]*?\s+from\s+['"](\.\.?\/[^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      const dirOfFile = path.dirname(filePath);
      
      // Xác định file đích thực tế
      let resolvedPath = path.resolve(dirOfFile, importPath);
      let exists = false;

      // Thử các phần mở rộng thông dụng (.jsx, .js, .css, hoặc index.js/index.jsx)
      const extensions = ['', '.jsx', '.js', '.css', '/index.jsx', '/index.js'];
      for (const ext of extensions) {
        const checkPath = resolvedPath + ext;
        if (fs.existsSync(checkPath) && fs.statSync(checkPath).isFile()) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        console.log(`${colors.red}❌ Lỗi Import Hỏng in [${relativePath}]:${colors.reset}`);
        console.log(`   - Không tìm thấy file: "${importPath}"`);
        brokenImportsCount++;
      }
    }

    // 2. Kiểm tra nhanh cú pháp React 19 / JSX cơ bản
    // Tránh lỗi chưa khai báo hàm đóng ngoặc hoặc sai tên biến CSS
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      console.log(`${colors.yellow}⚠ Cảnh báo lệch dấu ngoặc nhọn {} trong [${relativePath}]:${colors.reset}`);
      console.log(`   - Số lượng '{': ${openBraces}, số lượng '}': ${closeBraces}`);
      syntaxIssuesCount++;
    }
  }

  if (brokenImportsCount === 0) {
    console.log(`${colors.green}✔ Tuyệt vời! Không phát hiện liên kết import cục bộ nào bị hỏng.${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Đã tìm thấy ${brokenImportsCount} lỗi import bị hỏng. Hãy sửa ngay các đường dẫn tương đối này để tránh lỗi crash khi chạy dev hoặc build.${colors.reset}`);
  }

  if (syntaxIssuesCount > 0) {
    console.log(`${colors.yellow}⚠ Đã tìm thấy ${syntaxIssuesCount} tệp tin có dấu hiệu lệch ngoặc hoặc lỗi cú pháp tĩnh.${colors.reset}`);
  }
}

function verifyEnvSettings() {
  console.log(`\n${colors.bold}${colors.cyan}--- PHẦN E: KIỂM TRA CẤU HÌNH BIẾN MÔI TRƯỜNG (.ENV) ---${colors.reset}`);
  const envPath = 'd:/Duan/CHANDIVANEM/.env';
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}❌ Không tìm thấy tệp tin .env tại thư mục gốc của dự án!${colors.reset}`);
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredKeys = ['DATABASE_URL', 'JWT_SECRET', 'CLIENT_URL'];
  let missingKeys = 0;

  for (const key of requiredKeys) {
    if (!envContent.includes(key)) {
      console.log(`${colors.red}❌ Thiếu cấu hình bắt buộc: "${key}" trong tệp .env${colors.reset}`);
      missingKeys++;
    }
  }

  if (missingKeys === 0) {
    console.log(`${colors.green}✔ Cấu hình .env đầy đủ các biến bắt buộc.${colors.reset}`);
  }
}

function main() {
  console.log(`${colors.bold}${colors.cyan}================================================================`);
  console.log(`        BẮT ĐẦU CHẨN ĐOÁN FRONTEND & CẤU HÌNH DỰ ÁN`);
  console.log(`================================================================${colors.reset}`);

  verifyEnvSettings();
  verifyImportsAndPaths();

  console.log(`\n${colors.bold}${colors.green}--- CHẨN ĐOÁN FRONTEND HOÀN TẤT ---${colors.reset}\n`);
}

main();
