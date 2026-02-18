# Doc2Quiz - AI Quiz Generator 🎯

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-19.0-blue.svg?logo=react)
![Vite](https://img.shields.io/badge/vite-6.1-purple.svg?logo=vite)

An intelligent quiz generator that transforms documents into interactive quizzes using AI. Create, take, and analyze quizzes with an engaging and modern interface.

## ✨ Features

- **📄 Document Upload** - Upload documents via file input or drag-and-drop
- **🤖 AI-Powered Generation** - Automatically generate quizzes from your documents
- **🎮 Interactive Quiz Interface** - Smooth, responsive quiz-taking experience
- **📊 Analytics & Insights** - Track performance, scores, and statistics
- **🎨 Multiple Themes** - Choose from different visual themes (Cyber theme and more)
- **🏆 Achievements System** - Earn badges and track milestones
- **⏱️ Time Tracking** - Monitor time spent on each quiz
- **💡 Hints System** - Get helpful hints for difficult questions
- **🎉 Celebration Effects** - Confetti animations and sound effects on completion
- **📋 Review Mode** - Review answers and learn from mistakes
- **🔄 Progress Tracking** - Keep track of streaks and improvements

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/karthikeyamaddu/Quiz_frontend.git
cd Quiz_frontend

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

### Environment Variables

Create a `.env` file in the project root to configure the backend API:

```env
VITE_API_URL=https://quiz-app-cfhf.onrender.com
```

Access it in your code using:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## 📦 Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main application component
│   ├── FileUpload.jsx       # Quiz generation and quiz interface
│   ├── main.jsx             # React entry point
│   ├── App.css              # App styles
│   ├── QuizStyles.css       # Quiz-specific styles
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint rules
└── README.md               # This file
```

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library |
| **Vite** | Fast build tool and dev server |
| **Framer Motion** | Smooth animations |
| **React Confetti** | Celebration animations |
| **use-sound** | Audio effect management |
| **ESLint** | Code quality assurance |

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run deploy` | Deploy to GitHub Pages |

## 🎯 How to Use

1. **Upload a Document**
   - Click the upload area or drag and drop a file
   - Supported formats: PDF, Word, Text, etc.

2. **Generate Quiz**
   - The AI will analyze your document
   - A quiz will be automatically generated

3. **Take the Quiz**
   - Answer questions one by one
   - Use hints if needed
   - Track your time

4. **Review Results**
   - Check your score and analytics
   - Review incorrect answers
   - Track achievements

## 🌐 Deployment

### Frontend

This project is configured for GitHub Pages deployment:

```bash
npm run deploy
```

### Backend

The backend API is deployed on Render:

**API URL:** [https://quiz-app-cfhf.onrender.com](https://quiz-app-cfhf.onrender.com)

### Live Demo

[Doc2Quiz Frontend](https://karthikeyamaddu.github.io/Quiz_frontend/)

## 📝 Code Quality

ESLint is configured to maintain code quality:

```bash
npm run lint
```

## 🎨 Customization

- **Themes**: Modify theme settings in the FileUpload component
- **Styles**: Edit CSS files in the `src/` directory
- **Animations**: Adjust Framer Motion configurations for different effects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

[Kartikeya Maddu](https://github.com/karthikeyamaddu)

## 🐛 Known Issues & Future Improvements

- [ ] Add support for more document formats
- [ ] Implement user authentication
- [ ] Add database for quiz history
- [ ] Support for multiplayer quizzes
- [ ] Mobile app version

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

<div align="center">
  Made with ❤️ for learning
</div>
