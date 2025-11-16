
# Mini CRM

Projekt zawiera backend (Node.js + Express + SQLite) oraz frontend (React + Vite + Tailwind). 
W folderze `backend/data/` znajduje się pre-populowana baza SQLite `db.sqlite`.

## Uruchamianie backendu

1. Przejdź do folderu backend:
   cd backend
2. Zainstaluj zależności:
   npm install
3. Uruchom serwer:
   npm start

Serwer domyślnie nasłuchuje na http://localhost:4000

## Uruchamianie frontendu

1. Przejdź do folderu frontend:
   cd frontend
2. Zainstaluj zależności:
   npm install
3. Uruchom deweloperski serwer Vite:
   npm run dev

Frontend uruchomi się np. na http://localhost:5173

## Uwagi
- Backend automatycznie stworzy tabele jeśli bazy nie będzie jeszcze w `backend/data/db.sqlite`.
- W bazie znajdują się dwaj przykładowi klienci oraz dwa projekty (dla pierwszego klienta).
- Jeśli chcesz zresetować bazę, usuń plik `backend/data/db.sqlite` i uruchom serwer — plik zostanie utworzony od nowa.