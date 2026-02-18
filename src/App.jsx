import React from 'react';
import { motion } from 'framer-motion';
import './App.css';
import FileUpload from './FileUpload';

function App() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    const features = [
        { icon: '📄', title: 'Easy Upload', description: 'Upload any document via drag-and-drop' },
        { icon: '🤖', title: 'AI Magic', description: 'Intelligent quiz generation' },
        { icon: '📊', title: 'Analytics', description: 'Track your performance' },
        { icon: '🎯', title: 'Interactive', description: 'Engaging quiz experience' },
    ];

    return (
        <div className="App">
            {/* Header/Navbar */}
            <motion.header className="navbar" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="navbar-content">
                    <div className="logo-section">
                        <span className="logo-icon">📚</span>
                        <h2 className="logo-text">Doc2Quiz</h2>
                    </div>
                    <nav className="nav-links">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#upload" className="nav-link">Get Started</a>
                    </nav>
                </div>
            </motion.header>

            {/* Hero Section */}
            <motion.section className="hero" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div className="hero-content" variants={itemVariants}>
                    <h1 className="hero-title">Transform Documents Into Smart Quizzes</h1>
                    <p className="hero-subtitle">Use AI-powered technology to generate engaging quizzes from any document in seconds</p>
                    <motion.button
                        className="cta-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Start Creating Quizzes →
                    </motion.button>
                </motion.div>
                <motion.div className="hero-visual" variants={itemVariants}>
                    <div className="floating-card" style={{ animationDelay: '0s' }}>📖</div>
                    <div className="floating-card" style={{ animationDelay: '0.2s' }}>🧠</div>
                    <div className="floating-card" style={{ animationDelay: '0.4s' }}>✨</div>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <motion.section id="features" className="features">
                <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    Why Choose Doc2Quiz?
                </motion.h2>
                <motion.div className="features-grid" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    {features.map((feature, index) => (
                        <motion.div key={index} className="feature-card" variants={itemVariants} whileHover={{ y: -10 }}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Upload Section */}
            <motion.section id="upload-section" className="upload-section" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <motion.div className="upload-container" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <motion.h2 variants={itemVariants}>Ready to Get Started?</motion.h2>
                    <motion.p variants={itemVariants} className="upload-subtitle">
                        Upload your document below and let AI do the magic ✨
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <FileUpload />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2026 Doc2Quiz. Made with ❤️ for learning.</p>
            </footer>
        </div>
    );
}

export default App;
