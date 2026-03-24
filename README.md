# 🎯 AI Resume Job Matcher

A premium, full-stack AI-powered application that seamlessly matches candidates' resumes with the most relevant job postings using Gemini Semantic Embeddings and Cosine Similarity.

![AI Resume Matcher Banner](https://img.shields.io/badge/AI_Powered-Resume_Matching-blueviolet?style=for-the-badge)

## ✨ Features

- **🧠 Smart AI Parsing:** Uses Google Gemini to accurately extract and structure text from uploaded resumes (PDF or DOCX).
- **⚖️ Advanced Matching Algorithm:** Employs Google's Gemini API for state-of-the-art semantic embeddings and cosine similarity to mathematically rank jobs based on meaning, not just keywords.
- **💼 Job Management Portal:** Effortlessly create, view, and manage jobs directly from the database.
- **💎 Premium UI/UX:** Built with React and Tailwind CSS v4, featuring a modern, clean, high-contrast design (glassmorphism, micro-animations, dropzones).
- **💡 AI Improvement Advice:** Generates tailored, actionable advice on how to improve a specific resume for a specific job match.

---

## 🏗️ Technology Stack

### **Frontend**
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### **Backend**
- **Environment:** Node.js & Express.js
- **Database:** MongoDB (via Mongoose)
- **AI Integration:** Google GenAI SDK (Gemini)
- **File Handling:** Multer, `pdf-parse` (for PDF), `mammoth` (for DOCX)
- **NLP Analysis:** Cosine similarity for matching dense embedding vectors.

---

## 🚀 Getting Started

Provide these prerequisites to run the project locally.

### Prerequisites
1. **Node.js** (v18 or higher)
2. **MongoDB** (running locally on port `27017` or a MongoDB Atlas URI)
3. **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the repository

```bash
git clone https://github.com/yashaswi-20/AI-Resume-Job-Matcher.git
cd AI-Resume-Job-Matcher
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the example:
```bash
cp .env.example .env
```
Make sure your `backend/.env` looks like this:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai_resume_matcher
NODE_ENV=development
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

*(Optional)* Seed your database with sample jobs:
```bash
node seed_jobs.js
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend

Open a new terminal session.

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. View the App
Open your browser and navigate to `http://localhost:5173`.

---

## 📸 Screenshots & Usage

1. **Upload your Resume:** Drag and drop your PDF or DOCX file to let the Gemini parser extract all your core skills and experiences.
2. **Create Jobs:** Use the "Create Job" form to fill the database with potential positions.
3. **Get Matched:** Instantly see a ranked list of jobs in the system, accompanied by a percentage match score.
4. **Improve:** Click "Improve Resume" on any specific job to get a targeted breakdown of keywords you should add to land that specific role.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
