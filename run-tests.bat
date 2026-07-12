@echo off
title Bo Cong Cu Kiem Thu Tu Dong Chan Di Va Nem
echo ================================================================
echo           BAT DAU KIEU THU TOAN DIEN HE THONG
echo ================================================================
echo.

:: 1. Chay chan doan Backend & DB
node scripts/test-backend.js

:: 2. Chay chan doan Frontend Static Imports
node scripts/test-frontend.js

echo.
echo ================================================================
echo           KIEM THU HOAN TAT! HAY KIEM TRA CAC LOI (NEU CO)
echo ================================================================
pause
