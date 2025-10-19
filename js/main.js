// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }
  
  // Dark mode is now permanent - no theme toggle needed
  
  // ===== Game Loading Screen =====
  initGameLoader();
  
  // ===== Achievement System =====
  initAchievementSystem();
  
  // ===== FPS Counter =====
  initFPSCounter();
});

// ===== FPS Counter Implementation =====
function initFPSCounter() {
  const fpsValueElement = document.getElementById('fpsValue');
  const msValueElement = document.getElementById('msValue');
  const fpsStatusElement = document.getElementById('fpsStatus');
  
  if (!fpsValueElement) return;
  
  let lastTime = performance.now();
  let frames = 0;
  let fps = 60;
  
  function updateFPS() {
    const currentTime = performance.now();
    frames++;
    
    // Update every second
    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frames * 1000) / (currentTime - lastTime));
      const ms = ((currentTime - lastTime) / frames).toFixed(1);
      
      // Update display
      fpsValueElement.textContent = fps;
      msValueElement.textContent = ms;
      
      // Update status based on FPS
      if (fps >= 55) {
        fpsStatusElement.textContent = 'Optimal';
        fpsStatusElement.className = 'fps-status good';
      } else if (fps >= 30) {
        fpsStatusElement.textContent = 'Good';
        fpsStatusElement.className = 'fps-status medium';
      } else {
        fpsStatusElement.textContent = 'Low FPS';
        fpsStatusElement.className = 'fps-status low';
      }
      
      // Update color based on FPS
      if (fps >= 55) {
        fpsValueElement.style.color = '#10b981'; // Green
      } else if (fps >= 30) {
        fpsValueElement.style.color = '#f59e0b'; // Orange
      } else {
        fpsValueElement.style.color = '#ef4444'; // Red
      }
      
      // Reset counters
      frames = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(updateFPS);
  }
  
  // Start FPS monitoring
  requestAnimationFrame(updateFPS);
}

// ===== Game Loading Screen Implementation =====
function initGameLoader() {
  const loader = document.getElementById('gameLoader');
  const loadingBarFill = document.getElementById('loadingBarFill');
  const loadingPercentage = document.getElementById('loadingPercentage');
  const loadingTip = document.getElementById('loadingTip');
  
  const tips = [
    'Press START to continue...',
    'Remember to save your progress!',
    'Check your inventory for power-ups...',
    'Tip: Always read the quest log!',
    'Don\'t forget to level up your skills!',
    'Pro tip: Explore every corner!',
    'Achievement unlocked incoming...'
  ];
  
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // Hide loader after completion
      setTimeout(() => {
        loader.classList.add('hidden');
        // Show first achievement
        setTimeout(() => {
          showAchievement('Portfolio Loaded', 'Welcome, Developer!');
        }, 500);
      }, 500);
    }
    
    loadingBarFill.style.width = progress + '%';
    loadingPercentage.textContent = Math.floor(progress) + '%';
    
    // Change tips randomly
    if (Math.random() > 0.7) {
      loadingTip.textContent = tips[Math.floor(Math.random() * tips.length)];
    }
  }, 100);
}

// ===== Achievement System Implementation =====
let achievementQueue = [];
let isShowingAchievement = false;
const unlockedSections = new Set();

function initAchievementSystem() {
  const sections = document.querySelectorAll('section[id]');
  
  const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !unlockedSections.has(entry.target.id)) {
        unlockedSections.add(entry.target.id);
        
        const achievements = {
          'home': { title: 'Journey Begins', desc: 'Entered the Hero Section' },
          'skills': { title: 'Skill Tree Unlocked', desc: 'Discovered Your Abilities' },
          'projects': { title: 'Quest Log Opened', desc: 'Viewing Epic Projects' },
          'about': { title: 'Lore Master', desc: 'Reading the Backstory' },
          'contact': { title: 'Guild Invitation', desc: 'Contact Section Reached' }
        };
        
        const achievement = achievements[entry.target.id];
        if (achievement) {
          showAchievement(achievement.title, achievement.desc);
        }
      }
    });
  }, { threshold: 0.5 });
  
  sections.forEach(section => achievementObserver.observe(section));
  
  // Add click achievements for stat cards
  document.querySelectorAll('.stat-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      const statNames = ['Coding Power', 'Design Mastery', '3D Modeling', 'Game Logic'];
      showAchievement('Stat Inspected', `Examined ${statNames[index] || 'Skill'}`);
    });
  });
  
  // Add click achievements for badges
  document.querySelectorAll('.achievement-badge').forEach((badge) => {
    badge.addEventListener('click', () => {
      const badgeName = badge.querySelector('.badge-name').textContent;
      showAchievement('Badge Examined', `Viewed: ${badgeName}`);
    });
  });
}

function showAchievement(title, description) {
  const popup = document.getElementById('achievementPopup');
  const descElement = document.getElementById('achievementDesc');
  const titleElement = popup.querySelector('.achievement-title');
  
  // Add to queue if already showing
  if (isShowingAchievement) {
    achievementQueue.push({ title, description });
    return;
  }
  
  isShowingAchievement = true;
  
  // Update content
  titleElement.textContent = title;
  descElement.textContent = description;
  
  // Show popup
  popup.classList.add('show');
  
  // Hide after 3 seconds
  setTimeout(() => {
    popup.classList.remove('show');
    
    setTimeout(() => {
      isShowingAchievement = false;
      
      // Show next in queue
      if (achievementQueue.length > 0) {
        const next = achievementQueue.shift();
        showAchievement(next.title, next.description);
      }
    }, 500);
  }, 3000);
}


// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== Navbar Background on Scroll =====
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = 'var(--shadow-sm)';
  }
  
  // Update scroll progress bar
  updateScrollProgress();
});

// ===== Scroll Progress Bar =====
function updateScrollProgress() {
  const scrollProgress = document.getElementById('scrollProgress');
  if (!scrollProgress) return;
  
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  
  scrollProgress.style.width = scrolled + '%';
}

// ===== Active Link Highlighting =====
window.addEventListener('scroll', function() {
  let current = '';
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-card, .project-card, .contact-item').forEach(el => {
  observer.observe(el);
});

// ===== Proficiency Bar Animation =====
const proficiencyObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.proficiency-fill');
      fills.forEach(fill => {
        fill.style.animation = 'fillProgress 1.5s ease-out forwards';
      });
      proficiencyObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const proficiencySection = document.querySelector('.proficiency-section');
if (proficiencySection) {
  proficiencyObserver.observe(proficiencySection);
}

// ===== Add CSS for animations =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .nav-link.active::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    .nav-menu.active {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 70px;
      left: 0;
      width: 100%;
      background: white;
      padding: 2rem 0;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(10px, 10px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }
  }
`;
document.head.appendChild(style);

// ===== Parallax Effect for Hero =====
window.addEventListener('scroll', function() {
  const hero = document.querySelector('.hero');
  const scrolled = window.pageYOffset;
  if (hero && scrolled < hero.offsetHeight) {
    hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
  }
});

// ===== Dynamic Proficiency Bar Width =====
function animateProficiencyBars() {
  const bars = document.querySelectorAll('.proficiency-fill');
  bars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}

// Call on page load and intersection
window.addEventListener('load', animateProficiencyBars);

// ===== Interactive Project Cards =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// ===== Skill Card Interaction =====
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    const icon = this.querySelector('.skill-icon');
    if (icon) {
      icon.style.transform = 'scale(1.15) rotate(10deg)';
    }
  });
  
  card.addEventListener('mouseleave', function() {
    const icon = this.querySelector('.skill-icon');
    if (icon) {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }
  });
});

// ===== Counter Animation (if needed) =====
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// ===== Form Submission (if contact form exists) =====
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted');
  });
}

// ===== Initialize on Load =====
window.addEventListener('load', function() {
  console.log('Portfolio loaded successfully');
  
  // Add loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease-in';
    document.body.style.opacity = '1';
  }, 100);
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', function(e) {
  // Add keyboard shortcuts if needed
  if (e.key === 'Escape') {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      navMenu.classList.remove('active');
    }
  }
});

// ===== Performance: Debounce Scroll Events =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== Lazy Loading Support =====
if ('IntersectionObserver' in window) {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ===== Back to Top Button =====
function createBackToTop() {
  const button = document.createElement('button');
  button.innerHTML = '↑';
  button.className = 'back-to-top';
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  `;
  
  document.body.appendChild(button);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });
}

createBackToTop();

console.log('Portfolio JavaScript loaded and initialized');
