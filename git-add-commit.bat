@echo off
cd /d "C:\Users\Tom\Documents\Github\Chatops-commander"

echo.
echo ===== GIT STATUS BEFORE =====
git status
echo.

echo ===== STAGING ALL CHANGES =====
git add .

echo.
echo ===== GIT STATUS AFTER =====
git status
echo.

echo ===== COMMITTING CHANGES =====
git commit -m "fix(logo): import logo from public directory

- Change logo import method from URL path to ES6 import
- Import logo in Navbar.tsx, Login.tsx, and Register.tsx
- Use imported logo variable in img src attribute
- Better compatibility with Vite bundler
- Logo now displays correctly across all pages (40px in navbar, 64px in auth pages)"

echo.
echo ===== COMMIT RESULT =====
git log -1 --oneline

pause
