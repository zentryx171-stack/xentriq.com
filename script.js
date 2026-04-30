// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    (function() {
        emailjs.init("q4vjvs5b03ZnTr9LV");
    })();

    // Ensure all content is visible after a short delay (fallback)
    setTimeout(() => {
        const allAnimatedElements = document.querySelectorAll('.animate-on-scroll');
        allAnimatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }, 2000);

    // Initialize all features
    initParticles();
    initNavbar();
    initScrollEffects();
    initCounters();
    initTestimonials();
    initFAQ();
    initForms();
    initModal();
    initAnimations();
});

// ===== PARTICLE ANIMATION =====
function initParticles() {
    const particlesContainer = document.getElementById('heroParticles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ===== NAVBAR FUNCTIONALITY =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    // Scroll progress bar
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';

        // Back to top button visibility
        if (scrollTop > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const countUp = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => countUp(counter), 10);
        } else {
            counter.innerText = target;
        }
    };

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonials() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    let currentIndex = 0;

    window.changeTestimonial = function(direction) {
        testimonialItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + direction + testimonialItems.length) % testimonialItems.length;
        testimonialItems[currentIndex].classList.add('active');
    };

    // Auto-rotate testimonials
    setInterval(() => {
        changeTestimonial(1);
    }, 5000);
}

// ===== FAQ FUNCTIONALITY =====
function initFAQ() {
    window.toggleFAQ = function(element) {
        const faqItem = element.parentElement;
        const allFaqItems = document.querySelectorAll('.faq-item');
        
        // Close all other FAQ items
        allFaqItems.forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current FAQ item
        faqItem.classList.toggle('active');
    };
}

// ===== FORM SUBMISSION =====
function initForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            
            if (name && email && subject && message) {
                // Show success message (in production, this would send to EmailJS)
                showNotification('Message sent successfully! We will contact you soon.');
                contactForm.reset();
            } else {
                showNotification('Please fill in all fields.', 'error');
            }
        });
    }

    // Enrollment form
    const enrollmentForm = document.getElementById('enrollmentForm');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(enrollmentForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['fullName', 'age', 'gender', 'mobile', 'email', 'city', 'state', 'country', 'businessType', 'serviceNeeded', 'projectName', 'projectDescription', 'budget', 'deadline', 'hasLogo', 'hasDomain', 'needHosting'];
            
            let isValid = true;
            for (const field of requiredFields) {
                if (!data[field]) {
                    isValid = false;
                    break;
                }
            }
            
            if (isValid) {
                // Send email using EmailJS
                sendEnrollmentEmail(data);
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }
}

// ===== EMAILJS INTEGRATION =====
function sendEnrollmentEmail(data) {
    const templateParams = {
        fullName: data.fullName,
        age: data.age,
        gender: data.gender,
        mobile: data.mobile,
        whatsapp: data.whatsapp || 'Not provided',
        email: data.email,
        address: `${data.city}, ${data.state}, ${data.country}`,
        company: data.company || 'Not provided',
        businessType: data.businessType,
        serviceNeeded: data.serviceNeeded,
        projectName: data.projectName,
        projectDescription: data.projectDescription,
        features: data.features || 'Not specified',
        colors: data.colors || 'Not specified',
        budget: data.budget,
        deadline: data.deadline,
        hasLogo: data.hasLogo,
        hasDomain: data.hasDomain,
        needHosting: data.needHosting,
        additionalNotes: data.additionalNotes || 'None'
    };

    emailjs.send('service_82svxq8', 'template_qpgvn2k', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccessModal();
            document.getElementById('enrollmentForm').reset();
            closeEnrollment();
        }, function(error) {
            console.log('FAILED...', error);
            showNotification('Failed to send inquiry. Please try again.', 'error');
        });
}

// ===== MODAL FUNCTIONALITY =====
function initModal() {
    window.openEnrollment = function() {
        document.getElementById('enrollmentModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeEnrollment = function() {
        document.getElementById('enrollmentModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    window.closeSuccess = function() {
        document.getElementById('successModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Close modal on outside click
    document.getElementById('enrollmentModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEnrollment();
        }
    });

    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccess();
        }
    });
}

// ===== SUCCESS MODAL =====
function showSuccessModal() {
    document.getElementById('successModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #25d366, #20b358)' : 'linear-gradient(135deg, #ff4757, #ff3838)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== UTILITY FUNCTIONS =====
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.openWhatsApp = function() {
    // WhatsApp contact number: 7824918457
    const phoneNumber = '7824918457';
    const message = 'Hi! I\'m interested in your services.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
};

// ===== ANIMATION ON SCROLL =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add appropriate animation class based on element type
                const element = entry.target;
                
                // Remove initial hidden state and add visible animation
                element.classList.remove('animate-on-scroll');
                
                if (element.classList.contains('service-card') || 
                    element.classList.contains('stat-card') || 
                    element.classList.contains('portfolio-item') ||
                    element.classList.contains('faq-item') ||
                    element.classList.contains('feature-item')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                } else if (element.classList.contains('about-text')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                } else if (element.classList.contains('about-visual')) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                } else if (element.classList.contains('visual-card')) {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                } else {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== SMOOTH SCROLL FOR NAVIGATION LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            if (activeModal.id === 'enrollmentModal') {
                closeEnrollment();
            } else if (activeModal.id === 'successModal') {
                closeSuccess();
            }
        }
    }
});

// ===== LAZY LOADING FOR IMAGES =====
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// ===== PERFORMANCE OPTIMIZATION =====
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

// Debounced scroll handler for better performance
const debouncedScroll = debounce(() => {
    // Scroll-based animations can be added here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===== FORM VALIDATION HELPERS =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.length >= 10;
}

// ===== DYNAMIC YEAR IN FOOTER =====
function updateYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

updateYear();

// ===== CONSOLE BRANDING =====
console.log('%c Xentriq - Premium Digital Solutions ', 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c Build Today. Scale Tomorrow. ', 'color: #a0a0a0; font-size: 12px;');

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(style);
