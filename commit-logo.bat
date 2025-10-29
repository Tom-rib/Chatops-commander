@echo off
cd /d "C:\Users\Tom\Documents\Github\aisystant"

echo Checking git status...
git status

echo.
echo Adding changes...
git add frontend/src/pages/Register.tsx

echo.
echo Committing changes...
git commit -m "feat(logo): add AiSystant logo to Register page header

- Replace Terminal icon with logo image on Register page
- Align Register page header with Login page design
- Remove unused Terminal icon import from Register.tsx
- Logo now consistently displayed across all authentication pages (Login, Register)"

echo.
echo Commit completed successfully!
echo.
git log -1 --oneline
