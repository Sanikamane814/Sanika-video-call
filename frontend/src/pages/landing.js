
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { FaGlobe, FaMoon, FaSun, FaChevronDown, FaChevronUp, FaTimes, FaVideo, FaUsers, FaShieldAlt, FaComments, FaRecordVinyl, FaClosedCaptioning } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Link } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [showFeatures, setShowFeatures] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [userCount, setUserCount] = useState(0);
    const [countriesCount, setCountriesCount] = useState(0);
    const [recentRooms, setRecentRooms] = useState(['FAMILY123', 'TEAM456', 'FRIENDS789', 'CLASS101', 'MEETING202']);
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Typewriter effect
    const [displayText, setDisplayText] = useState('');
    const fullTexts = ["Connect with your loved ones", "High quality video calls", "Simple, secure, and free"];
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    // Animated counter effect
    useEffect(() => {
        const handleScroll = () => {
            const statsSection = document.querySelector('.stats');
            if (statsSection) {
                const rect = statsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    animateCounter(0, 10245, 2000, value => setUserCount(Math.floor(value)));
                    animateCounter(0, 56, 2000, value => setCountriesCount(Math.floor(value)));
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Typewriter effect logic
    useEffect(() => {
        if (isTyping) {
            if (currentIndex < fullTexts[currentTextIndex].length) {
                const timeout = setTimeout(() => {
                    setDisplayText(prev => prev + fullTexts[currentTextIndex][currentIndex]);
                    setCurrentIndex(prev => prev + 1);
                }, 100);
                return () => clearTimeout(timeout);
            } else {
                const pauseTimeout = setTimeout(() => {
                    setIsTyping(false);
                }, 1500);
                return () => clearTimeout(pauseTimeout);
            }
        } else {
            if (displayText.length > 0) {
                const timeout = setTimeout(() => {
                    setDisplayText(prev => prev.slice(0, -1));
                }, 50);
                return () => clearTimeout(timeout);
            } else {
                const nextTextIndex = (currentTextIndex + 1) % fullTexts.length;
                setCurrentTextIndex(nextTextIndex);
                setCurrentIndex(0);
                setIsTyping(true);
            }
        }
    }, [currentIndex, isTyping, displayText, currentTextIndex]);

    const animateCounter = (start, end, duration, callback) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            callback(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const particlesInit = async (engine) => {
        await loadSlim(engine);
    };

    const particlesLoaded = (container) => {
        console.log(container);
    };

    const features = [
        { icon: <FaVideo size={24} />, title: 'HD Video', description: 'Crystal clear 1080p video quality' },
        { icon: <FaUsers size={24} />, title: 'Group Meetings', description: 'Up to 50 participants in one call' },
        { icon: <FaShieldAlt size={24} />, title: 'Encryption', description: 'End-to-end encrypted for privacy' },
        { icon: <FaComments size={24} />, title: 'Chat', description: 'Real-time text chat during calls' },
        { icon: <FaRecordVinyl size={24} />, title: 'Recording', description: 'Record your meetings locally' },
        { icon: <FaClosedCaptioning size={24} />, title: 'Captions', description: 'Live captions in multiple languages' }
    ];

    const testimonials = [
        { name: 'Rahul Sharma', role: 'Freelancer', text: 'Sanika made remote work so easy for me. The quality is amazing!', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { name: 'Priya Patel', role: 'Teacher', text: 'I use it for online classes. Super reliable and students love it.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { name: 'Amit Singh', role: 'Business Owner', text: 'Our team is distributed across 5 countries. Sanika connects us daily.', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' }
    ];

    const faqs = [
        { question: 'How to join a meeting?', answer: 'Click "Join as Guest" and enter the room code provided by the host.' },
        { question: 'Is it really free?', answer: 'Yes! All basic features are completely free to use forever.' },
        { question: 'What devices are supported?', answer: 'Sanika works on all devices - Windows, Mac, Android, iOS, and web browsers.' },
        { question: 'How many people can join?', answer: 'Free rooms support up to 10 participants. Pro plans allow up to 50.' }
    ];

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' }
    ];

    const handleJoinMeeting = () => {
        if (roomCode.trim()) {
            navigate(`/${roomCode.trim().toUpperCase()}`);
        }
    };

    const handleTryDemo = () => {
        const demoCode = 'DEMO' + Math.floor(1000 + Math.random() * 9000);
        navigate(`/${demoCode}`);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={`landing-page ${theme}`}>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    fpsLimit: 60,
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                        },
                        modes: {
                            repulse: {
                                distance: 100,
                                duration: 0.4,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: theme === 'dark' ? "#ffffff" : "#3f51b5",
                        },
                        links: {
                            color: theme === 'dark' ? "#ffffff" : "#3f51b5",
                            distance: 150,
                            enable: true,
                            opacity: 0.3,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 1,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 50,
                        },
                        opacity: {
                            value: 0.3,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 3 },
                        },
                    },
                    detectRetina: true,
                }}
            />

            <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} fixed-top`}>
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <h2 className="logo">Sanika <span>Video Call</span></h2>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveTab('home');
                                        setIsMenuOpen(false);
                                    }}
                                    href="#home"
                                >Home</a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    onClick={() => {
                                        setActiveTab('features');
                                        setIsMenuOpen(false);
                                    }}
                                    href="#features"
                                >Features</a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    onClick={() => {
                                        setShowJoinModal(true);
                                        setIsMenuOpen(false);
                                    }}
                                >Join as Guest</a>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-primary ms-2"
                                    onClick={() => {
                                        navigate("/auth");
                                        setIsMenuOpen(false);
                                    }}
                                >Login/Register</button>
                            </li>
                            <li className="nav-item ms-2">
                                <button className="btn btn-outline-secondary" onClick={toggleTheme}>
                                    {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
                                </button>
                            </li>
                            <li className="nav-item dropdown ms-2">
                                <button
                                    className="btn btn-outline-secondary dropdown-toggle"
                                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                >
                                    <FaGlobe size={18} />
                                </button>
                                {showLanguageDropdown && (
                                    <div className={`dropdown-menu dropdown-menu-end ${theme === 'dark' ? 'dropdown-menu-dark' : ''} show`}>
                                        {languages.map(lang => (
                                            <a
                                                key={lang.code}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setShowLanguageDropdown(false);
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                {lang.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {showJoinModal && (
                <div className="modal-backdrop show">
                    <div className="modal fade show" style={{ display: 'block' }}>
                        <div className={`modal-dialog modal-dialog-centered ${theme === 'dark' ? 'dark-modal' : ''}`}>
                            <div className={`modal-content ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Join a Meeting</h5>
                                    <button
                                        type="button"
                                        className={`btn-close ${theme === 'dark' ? 'btn-close-white' : ''}`}
                                        onClick={() => setShowJoinModal(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Enter the room code provided by your host</p>
                                    <input
                                        type="text"
                                        className={`form-control ${theme === 'dark' ? 'bg-secondary text-white' : ''}`}
                                        placeholder="Room Code (e.g. ABC123)"
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
                                    />
                                    <div className="recent-rooms mt-3">
                                        <p className="text-muted mb-2">Recent rooms:</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {recentRooms.map((room, index) => (
                                                <span
                                                    key={index}
                                                    className="badge bg-secondary cursor-pointer"
                                                    onClick={() => {
                                                        setRoomCode(room);
                                                    }}
                                                >
                                                    {room}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleJoinMeeting}
                                        disabled={!roomCode.trim()}
                                    >
                                        Join Now
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={handleTryDemo}
                                    >
                                        Try Demo Room
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section id="home" className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="mb-4"
                            >
                                <span className="gradient-text">Sanika Video Call</span> - <span className="typewriter">{displayText}</span>
                                <span className="cursor">|</span>
                            </motion.h1>

                            <motion.p
                                className="subtitle mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                Premium quality video calls with cutting-edge technology. No downloads required.
                            </motion.p>

                            <motion.div
                                className="cta-buttons mb-5"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <motion.button
                                    className="btn btn-primary btn-lg me-3"
                                    onClick={() => navigate("/auth")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Get Started for Free
                                </motion.button>
                                <motion.button
                                    className="btn btn-outline-primary btn-lg"
                                    onClick={() => setShowJoinModal(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Join as Guest
                                </motion.button>
                            </motion.div>

                            <motion.div
                                className="stats row text-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <div className="col-md-4 stat-item">
                                    <h3 className="counter">{userCount.toLocaleString()}+</h3>
                                    <p>Daily Users</p>
                                </div>
                                <div className="col-md-4 stat-item">
                                    <h3 className="counter">99.9%</h3>
                                    <p>Uptime</p>
                                </div>
                                <div className="col-md-4 stat-item">
                                    <h3 className="counter">{countriesCount}+</h3>
                                    <p>Countries</p>
                                </div>
                            </motion.div>
                        </div>
                        <div className="col-lg-6">
                            <motion.div
                                className="hero-image-container"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <div className="hero-image">
                                    <div className="video-preview"></div>
                                    <div className="floating-participants">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className={`participant participant-${i}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="features-section">
                <div className="container">
                    <motion.h2
                        className="text-center mb-5 section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Why Choose Sanika?
                    </motion.h2>
                    <div className="row g-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="col-md-6 col-lg-4"
                                whileHover={{ y: -10 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className={`feature-card p-4 h-100 ${theme === 'dark' ? 'dark-card' : ''}`}>
                                    <div className="feature-icon">
                                        {feature.icon}
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="testimonials-section">
                <div className="container">
                    <motion.h2
                        className="text-center mb-5 section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        What Our Users Say
                    </motion.h2>
                    <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className={`carousel-item ${index === activeTestimonial ? 'active' : ''}`}
                                >
                                    <div className={`testimonial-card ${theme === 'dark' ? 'dark-card' : ''}`}>
                                        <div className="testimonial-content">
                                            <p className="testimonial-text">"{testimonial.text}"</p>
                                            <div className="testimonial-author">
                                                <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                                                <div>
                                                    <h4>{testimonial.name}</h4>
                                                    <span className="text-muted">{testimonial.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#testimonialCarousel"
                            data-bs-slide="prev"
                            onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#testimonialCarousel"
                            data-bs-slide="next"
                            onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </section>

            <section className="recent-meetings">
                <div className="container">
                    <motion.h2
                        className="text-center mb-4 section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Recently Active Rooms
                    </motion.h2>
                    <motion.p
                        className="text-center mb-5"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Join these popular public rooms
                    </motion.p>
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        {recentRooms.map((room, index) => (
                            <motion.div
                                key={index}
                                className={`room-card ${theme === 'dark' ? 'dark-card' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => navigate(`/${room}`)}
                            >
                                <h3>{room}</h3>
                                <span>Click to join</span>
                                <div className="participants-count">
                                    <FaUsers className="me-1" /> {Math.floor(Math.random() * 5) + 1} active
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="faq-section">
                <div className="container">
                    <motion.h2
                        className="text-center mb-5 section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <div className="accordion" id="faqAccordion">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                className={`accordion-item ${theme === 'dark' ? 'dark-card' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <h3 className="accordion-header">
                                    <button
                                        className={`accordion-button ${expandedFaq !== index ? 'collapsed' : ''} ${theme === 'dark' ? 'dark-accordion' : ''}`}
                                        type="button"
                                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    >
                                        {faq.question}
                                    </button>
                                </h3>
                                <div
                                    className={`accordion-collapse collapse ${expandedFaq === index ? 'show' : ''}`}
                                >
                                    <div className="accordion-body">
                                        {faq.answer}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="final-cta">
                <div className="container text-center">
                    <motion.h2
                        className="mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Ready to Connect?
                    </motion.h2>
                    <motion.p
                        className="fs-5 mb-5"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Join thousands of happy users today
                    </motion.p>
                    <div className="d-flex justify-content-center gap-3">
                        <motion.button
                            className="btn btn-light btn-lg px-4"
                            onClick={() => navigate("/auth")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Get Started for Free
                        </motion.button>
                        <motion.button
                            className="btn btn-outline-light btn-lg px-4"
                            onClick={handleTryDemo}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Try Demo Room
                        </motion.button>
                    </div>
                </div>
            </section>

            <footer className={`${theme === 'dark' ? 'dark-footer' : ''}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 mb-4">
                            <h3 className="logo">Sanika Video</h3>
                            <p>Premium quality video calls for everyone. Simple, secure, and free.</p>
                        </div>
                        <div className="col-lg-2 col-md-4 mb-4">
                            <h5>Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><a href="#home">Home</a></li>
                                <li><a href="#features">Features</a></li>
                                <li><Link to="/auth">Login</Link></li>
                                <li><a href="#" onClick={() => setShowJoinModal(true)}>Join Meeting</a></li>
                            </ul>
                        </div>
                       
                      
                        <div className="col-lg-4 col-md-4 mb-4">
    <h5>Connect With Us</h5>
    <div className="social-links">
        {[
            { name: 'facebook', url: 'https://facebook.com/yourpage' },
            { name: 'twitter', url: 'https://twitter.com/yourhandle' },
            { name: 'instagram', url: 'https://instagram.com/yourprofile' },
            { name: 'linkedin', url: 'https://linkedin.com/company/yourcompany' },
            { name: 'youtube', url: 'https://youtube.com/yourchannel' }
        ].map((social) => (
            <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                whileHover={{ 
                    y: -5,
                    scale: 1.1,
                    color: '#3a86ff' // Change color on hover
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                aria-label={`Follow us on ${social.name}`}
                title={`Follow us on ${social.name}`}
            >
                <i className={`fab fa-${social.name} fs-4`}></i>
                <span className="visually-hidden">{social.name}</span>
            </motion.a>
        ))}
    </div>
    
    {/* Additional Functionality */}
    <div className="mt-3">
        <h6>Subscribe to our newsletter</h6>
        <form className="d-flex">
            <input 
                type="email" 
                className="form-control me-2" 
                placeholder="Your email" 
                aria-label="Email for newsletter"
                required
            />
            <motion.button 
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
            >
                Subscribe
            </motion.button>
        </form>
    </div>
    
    <div className="mt-3">
        <h6>Contact Us</h6>
        <motion.a
            href="mailto:contact@example.com"
            className="d-block text-decoration-none"
            whileHover={{ x: 5 }}
        >
            <i className="fas fa-envelope me-2"></i> sanikamane@example.com
        </motion.a>
        <motion.a
            href="tel:+1234567890"
            className="d-block text-decoration-none"
            whileHover={{ x: 5 }}
        >
            <i className="fas fa-phone me-2"></i> +1 (234) 567-890
        </motion.a>
    </div>
</div>
                    </div>
                    <div className="text-center pt-3 border-top">
                        <p>© {new Date().getFullYear()} Sanika Video Call. Designed & Developed ❤️ by Sanika Mane.</p>
                    </div>
                </div>
            </footer>
        </div>
    );}