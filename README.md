# AI-Powered Quiz Generator - Frontend

## **Overview**
The **AI-Powered Quiz Generator** is a web application that allows users to upload PDFs, extract text, and generate quizzes using AI. This repository contains the frontend code built with **React**, providing an interactive user interface for taking quizzes, submitting answers, and viewing detailed performance analytics.

## **Features**
- **User-Friendly Interface** – A sleek and modern UI for seamless interaction.
- **PDF Upload & Processing** – Uploads PDF files for text extraction.
- **AI-Powered Quiz Generation** – Generates multiple-choice questions from extracted text using **Google's Gemini API**.
- **Interactive Quiz Experience** – Users can take quizzes with a **progress bar** and question navigation.
- **Results & Analytics** – Displays score, average performance, and quiz history.
- **Responsive Design** – Works smoothly across different devices.

## **Tech Stack**
- **React** – Frontend framework for building a dynamic UI.
- **CSS** – Custom styling for a futuristic look.
- **GitHub Pages** – Deployment platform.

## **Installation & Setup**
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/karthikeyamaddu/Quiz_frontend.git
   cd Quiz_frontend
   ```
2. **Install Dependencies:**
   ```sh
   npm install
   ```
3. **Start the Development Server:**
   ```sh
   npm run dev
   ```
4. **Open in Browser:**
   Navigate to `http://localhost:5173/` (or the provided local server URL).

## **Deployment**
The frontend is deployed on **GitHub Pages** and can be accessed at:
[Quiz Frontend](https://karthikeyamaddu.github.io/Quiz_frontend/)

## **API Endpoints (Backend Integration)**
- **`/upload`** – Uploads PDF and processes text.
- **`/submit-result`** – Submits quiz answers and calculates scores.
- **`/quiz-stats/<quiz_id>`** – Retrieves quiz performance statistics.

## **Future Enhancements**
- **User Authentication** – Personalized quiz tracking.
- **Quiz Customization** – Allow users to choose difficulty and question count.
- **Leaderboard** – Display top performers.
- **Enhanced Analytics** – Track time spent per question.

## **Contributing**
Contributions are welcome! Feel free to fork the repo, create a new branch, and submit a pull request.

## **License**
This project is licensed under the **MIT License**.

