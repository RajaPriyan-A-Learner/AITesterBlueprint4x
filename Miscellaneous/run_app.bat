@echo off
echo Starting Vision OCR Chatbot Backend and Frontend...
start cmd /k "cd backend && npm start"
start cmd /k "cd frontend && npm run dev"
echo Both servers started!
echo Frontend will be accessible at http://localhost:5173
