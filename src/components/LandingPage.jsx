import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LandingPage.css';

const DepartmentCard = ({ department, index, isActive, onClick }) => {
  const colors = [
    { primary: '#3498db', secondary: '#2980b9', gradient: 'linear-gradient(135deg, #6ab1e7, #2980b9)' },
    { primary: '#2ecc71', secondary: '#27ae60', gradient: 'linear-gradient(135deg, #82e9b0, #27ae60)' },
    { primary: '#e74c3c', secondary: '#c0392b', gradient: 'linear-gradient(135deg, #f29f97, #c0392b)' },
    { primary: '#9b59b6', secondary: '#8e44ad', gradient: 'linear-gradient(135deg, #cd93e0, #8e44ad)' },
    { primary: '#f39c12', secondary: '#d35400', gradient: 'linear-gradient(135deg, #ffbe76, #d35400)' },
    { primary: '#1abc9c', secondary: '#16a085', gradient: 'linear-gradient(135deg, #87dfd1, #16a085)' },
  ];
  
  const color = colors[index % colors.length];
  
  return (
    <motion.div 
      className={`department-card ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive 
          ? '0 15px 35px rgba(0, 0, 0, 0.25)' 
          : '0 8px 20px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -15,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
      onClick={onClick}
      style={{
        borderTop: isActive ? `none` : `5px solid ${color.primary}`,
        background: isActive ? color.gradient : '#ffffff',
        color: isActive ? 'white' : 'inherit'
      }}
    >
      {isActive && (
        <motion.div 
          className="card-shine"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
      
      <motion.div 
        className="card-icon-wrapper"
      
        transition={{ 
          duration: isActive ? 0.8 : 0.3,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          delay: isActive ? 0.2 : 0
        }}
      >
        <div 
          className="card-icon" 
          style={{ 
            background: isActive ? 'white' : color.gradient,
            color: isActive ? color.primary : 'white'
          }}
        >
          <i className={getIconForDepartment(department.title)}></i>
          
          {isActive && (
            <motion.div 
              className="icon-particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="icon-particle"
                  initial={{ x: 0, y: 0, opacity: 0.8 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 40, 
                    y: (Math.random() - 0.5) * 40,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 + (i * 0.1),
                    repeat: Infinity,
                    repeatDelay: Math.random() + 0.5
                  }}
                  style={{
                    background: color.primary,
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <motion.h3
        animate={{ 
          color: isActive ? 'white' : '#333',
          y: isActive ? [0, -5, 0] : 0
        }}
        transition={{ 
          duration: isActive ? 0.5 : 0.3,
          delay: isActive ? 0.1 : 0
        }}
      >
        {department.title}
      </motion.h3>
      
      <AnimatePresence>
        {isActive && (
          <motion.div 
            className="card-details"
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <p>{department.description}</p>
            <motion.div 
              className="card-details-decoration"
              initial={{ width: 0 }}
              animate={{ width: '40px' }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const getIconForDepartment = (title) => {
  const icons = {
    'Génie Civil': 'fas fa-building',
    'Génie de l\'Hydraulique, de l\'Environnement et de la ville': 'fas fa-water',
    'Génie Electrique': 'fas fa-bolt',
    'Sciences de l\'Information Géographique': 'fas fa-map-marked-alt',
    'Météorologie': 'fas fa-cloud-sun',
    'Génie Informatique': 'fas fa-laptop-code'
  };
  
  return icons[title] || 'fas fa-graduation-cap';
};

const Contributor = ({ contributor, index }) => {
  return (
    <motion.div 
      className="contributor"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="contributor-avatar">
        <img src={contributor.avatar || `/src/assets/${contributor.avatarFile || 'Abdeljabbar.jpg'}`} alt={contributor.name} />
      </div>
      <div className="contributor-info">
        <h4>{contributor.name}</h4>
        <p>{contributor.role}</p>
        <div className="contributor-links">
          {contributor.github && (
            <a href={contributor.github} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          )}
          {contributor.linkedin && (
            <a href={contributor.linkedin} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Landing Page component
const LandingPage = ({ onEnterPlan }) => {
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  
  // Department data
  const departments = [
    {
      title: 'Génie Civil',
      description: 'Formation d\'ingénieurs spécialisés dans la conception, la construction et la maintenance des infrastructures comme les bâtiments, routes, ponts et barrages.'
    },
    {
      title: 'Génie de l\'Hydraulique, de l\'Environnement et de la ville',
      description: 'Formation centrée sur la gestion des ressources en eau, l\'assainissement, et les solutions environnementales pour le développement urbain durable.'
    },
    {
      title: 'Génie Electrique',
      description: 'Formation d\'experts en systèmes électriques, électroniques, automatismes et réseaux pour les infrastructures modernes.'
    },
    {
      title: 'Sciences de l\'Information Géographique',
      description: 'Spécialisation dans les systèmes d\'information géographique (SIG), la cartographie numérique et l\'analyse spatiale des données.'
    },
    {
      title: 'Météorologie',
      description: 'Formation sur les sciences atmosphériques, la prévision météorologique et l\'étude du climat pour les applications environnementales et urbaines.'
    },
    {
      title: 'Génie Informatique',
      description: 'Formation en développement logiciel, intelligence artificielle, réseaux informatiques et systèmes d\'information pour les travaux publics.'
    }
  ];
  
  // Contributors data
  const contributors = [
    {
      name: 'Abdeljabbar Elgaddari',
      role: 'Lead Developer',
      avatarFile: 'Abdeljabbar.jpg',
      github: 'https://github.com/abdeljabbarelgaddari',
      linkedin: 'https://linkedin.com/in/abdeljabbarelgaddari'
    },
    {
      name: 'Yassine Bouhaddioui',
      role: 'UX/UI Designer',
      avatarFile: 'Yassine.jpg',
      github: 'https://github.com/yassinebouhaddioui',
      linkedin: 'https://linkedin.com/in/yassinebouhaddioui'
    }
  ];

  useEffect(() => {
    // Simulating loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Show button after user has viewed some departments
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(buttonTimer);
    };
  }, []);

  // Handle card click
  const handleCardClick = (index) => {
    setActiveDepartment(index === activeDepartment ? null : index);
  };

  // Handle scroll animation to map
  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
      setTimeout(onEnterPlan, 1000); // Transition to map after scroll animation
    } else {
      onEnterPlan(); // Fallback
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div 
          className="loader"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
          }}
        >
          <i className="fas fa-map-marked-alt"></i>
        </motion.div>
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Hassania Geoportal
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero section with advanced animations */}
      <div className="hero-wrapper">
        <motion.div 
          className="hero-parallax"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div 
            className="hero-shape shape-1"
            animate={{ 
              x: [0, 20, 0], 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="hero-shape shape-2"
            animate={{ 
              x: [0, -30, 0], 
              y: [0, 30, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="hero-shape shape-3"
            animate={{ 
              x: [0, 25, 0], 
              y: [0, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div 
            className="hero-shape shape-4"
            animate={{ 
              x: [0, -15, 0], 
              y: [0, -25, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1.5
            }}
          />
        </motion.div>
        
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="hero-content">
            <motion.div 
              className="title-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <motion.h1
                className="main-title"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
              >
                <motion.span 
                  className="title-highlight"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 1 }}
                />
                École Hassania des Travaux Publics
              </motion.h1>
              <motion.div 
                className="title-decoration"
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </motion.div>
            
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              Découvrez notre institution d'excellence en ingénierie à travers un plan interactif
            </motion.p>
            
            <motion.div 
              className="hero-particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1.6 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="particle"
                  initial={{ 
                    x: Math.random() * 100 - 50, 
                    y: Math.random() * 100 - 50,
                    opacity: Math.random() * 0.5 + 0.3
                  }}
                  animate={{ 
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 10 + 2}px`,
                    height: `${Math.random() * 10 + 2}px`,
                  }}
                />
              ))}
            </motion.div>
          </div>
          <div className="hero-overlay"></div>
        </motion.div>
      </div>

      {/* Departments section */}
      <section className="departments-section">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Nos Filières d'Excellence
        </motion.h2>
        <div className="departments-grid">
          {departments.map((department, index) => (
            <DepartmentCard
              key={index}
              department={department}
              index={index}
              isActive={activeDepartment === index}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
        
        {/* Animated map button */}
        <AnimatePresence>
          {showButton && (
            <motion.div 
              className="map-button-container"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 120
              }}
              ref={mapRef}
            >
              <motion.button
                className="map-button"
                onClick={scrollToMap}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  background: [
                    'linear-gradient(45deg, #3498db, #2ecc71)',
                    'linear-gradient(45deg, #2ecc71, #9b59b6)',
                    'linear-gradient(45deg, #9b59b6, #e74c3c)',
                    'linear-gradient(45deg, #e74c3c, #f39c12)',
                    'linear-gradient(45deg, #f39c12, #3498db)'
                  ]
                }}
                transition={{ 
                  background: { 
                    duration: 10, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }
                }}
              >
                <span>Découvrir le Plan Interactif</span>
                <i className="fas fa-map-marked-alt"></i>
                
                {/* Animated pulse effect */}
                <motion.div 
                  className="pulse"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Contributors section */}
      <section className="contributors-section">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Notre Équipe
        </motion.h2>
        <div className="contributors-grid">
          {contributors.map((contributor, index) => (
            <Contributor key={index} contributor={contributor} index={index} />
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p>© 2025 Hassania Geoportal - Tous droits réservés</p>
      </motion.footer>
    </div>
  );
};

export default LandingPage;