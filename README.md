# 🧠 IntellectAI – AI-Powered Structured Learning Suite

IntellectAI is an AI-powered study platform that transforms any topic into a structured learning experience. Using the **Google Gemini API**, it generates organized study notes, interactive flashcards, and quizzes to help students learn faster and retain information more effectively.

🌐 **Live Demo:** https://study-assistant-drab.vercel.app/

---

## ✨ Features

- 📚 **AI-Generated Study Modules**
  - Generate comprehensive, structured notes for any topic using Google Gemini AI.

- 🃏 **Interactive Flashcards**
  - Review key concepts with animated 3D flip cards for active recall.

- 📝 **AI Quiz Generator**
  - Automatically create quizzes with instant scoring and feedback.

- 💾 **Study History**
  - Saves your last five study sessions using `localStorage` for quick access.

- 🎨 **Modern Glassmorphism UI**
  - Premium dark theme with responsive layouts, glowing backgrounds, floating animations, and smooth transitions.

- ⚡ **Fast Performance**
  - Built with React + Vite for lightning-fast development and optimized production builds.

---

## 🛠️ Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- JavaScript

### Backend

- Node.js
- Express.js
- Google Gemini API (`@google/generative-ai`)

### Storage

- LocalStorage (Study History)

---

## 📁 Project Structure

```text
study-assistant/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FlashcardDeck.jsx
│   │   │   └── QuizView.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running the project, make sure you have:

- Node.js (v18 or above)
- npm
- Google Gemini API Key

Get your API key from:

https://aistudio.google.com/

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/ridafatima1210/study-assistant.git

cd study-assistant
```

---

## 2️⃣ Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the **server** folder.

```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
node index.js
```

Backend runs on:

```
http://localhost:5001
```

---

## 3️⃣ Frontend Setup

Open another terminal.

Navigate to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🌐 Deployment

## Frontend

Hosted on **Vercel**

- Root Directory: `client`
- Build Command:

```bash
npm run build
```

- Output Directory:

```
dist
```

---

## Backend

Hosted on **Render**

Environment Variables:

```env
GEMINI_API_KEY=your_api_key
```

The server automatically uses:

```javascript
process.env.PORT
```

for deployment compatibility.

---

# 💡 How It Works

1. Enter any study topic.
2. The backend sends the prompt to the Google Gemini API.
3. Gemini generates:
   - Structured study notes
   - Flashcards
   - Quiz questions
4. Users can:
   - Read notes
   - Practice with flashcards
   - Test knowledge through quizzes
5. The latest five sessions are automatically saved in local storage.

---

# 🔮 Future Enhancements

- User authentication
- Cloud database support
- PDF export for notes
- Progress tracking
- AI-generated summaries
- Voice-assisted learning
- Dark/Light mode toggle
- Bookmark favorite topics

---

# 👩‍💻 Author

**Rida Fatima**

- GitHub: https://github.com/ridafatima1210
- LinkedIn: https://www.linkedin.com/in/ridafatima1210/

---

## ⭐ Support

If you found this project helpful, consider giving it a **⭐ on GitHub**.

It helps support the project and motivates future improvements.
