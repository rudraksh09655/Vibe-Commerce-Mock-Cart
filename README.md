# 🛍️ Vibe Commerce — Mock E-Com Cart

A full-stack shopping cart demo built for **Vibe Commerce** screening.  
This project demonstrates API, DB, and UI integration for e-commerce flows — add to cart, remove items, checkout, and mock receipt generation.

---

## 🧠 Tech Stack

**Frontend:** React (CRA), modern responsive UI (CSS Grid/Flex)  
**Backend:** Node.js + Express  
**Database:** SQLite (persistent, local)  
**Bonus Features:**  
- Mock user persistence (per-user carts)  
- Error handling  
- Currency conversion (USD → INR)  
- Optional Fake Store API integration  

---

## 🚀 Setup Guide
---

### ⚙️ 2. Backend Setup

#### 📁 Navigate to the backend folder
```bash
cd backend
npm install
```
##### .env 
```
PORT=4000
DB_PATH=./vibe.db
NODE_ENV=development
DEFAULT_USER_ID=1

npm run init-db
npm install node-fetch@2(optional)
node seed-fakestore.js(optional)

npm run dev
````

### 💻 3. Frontend Setup

#### 📁 Navigate to the frontend folder
```bash
cd frontend
npm install
```
#### .env.local
```
REACT_APP_API_URL=http://localhost:4000
REACT_APP_USER_ID=1

npm run dev
```
