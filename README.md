# 🛍️ Vibe Commerce — Mock E-Com Cart

A full-stack shopping cart demo built for **Vibe Commerce** screening.  
This project demonstrates API, DB, and UI integration for e-commerce flows — add to cart, remove items, checkout, and mock receipt generation.

---

## DEMO VIDEI : [https://drive.google.com/file/d/1C-Gs3ThmrcHuh9apNwGnQWhdxpNyhHmt/view?usp=sharing]

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

## 📸 Screenshots

<p align="center">
  <strong>🏠 HOME PAGE</strong><br>
  <img src="https://github.com/user-attachments/assets/2832af4f-8b71-401f-9053-50fb7599dda6" alt="HOME PAGE" width="85%">
</p>

<p align="center">
  <strong>🛒 CART VIEW</strong><br>
  <img src="https://github.com/user-attachments/assets/dd909035-2870-4d21-a35b-fa2e6a88a47b" alt="CART VIEW" width="40%">
</p>

<p align="center">
  <strong>💳 CHECKOUT VIEW</strong><br>
  <img src="https://github.com/user-attachments/assets/6cb6c7d7-dfa1-47d6-9474-11e314488518" alt="CHECKOUT VIEW" width="45%">
</p>

<p align="center">
  <strong>📜 RECEIPT VIEW</strong><br>
  <img src="https://github.com/user-attachments/assets/1b483f6c-7d6b-40a0-af19-547503ead543" alt="RECEIPT VIEW" width="40%">
</p>




