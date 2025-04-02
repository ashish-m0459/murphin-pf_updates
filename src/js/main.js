// DOM Elements
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const featuredGrid = document.querySelector('.featured-grid');
const contactForm = document.getElementById('contact-form');
const skillsSection = document.querySelector('.skills');

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollEffects();
    initializeNavigation();
    initializeContactForm();
    initializeAnimations();
    initializeFeaturedWorksHover();
});

// Handle header styling on scroll
function initializeScrollEffects() {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Handle mobile navigation
function initializeNavigation() {
    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// JavaScript logic for Featured Works hover effect
function initializeFeaturedWorksHover() {
    if (!featuredGrid) return;

    const items = featuredGrid.querySelectorAll('.featured-item');

    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            featuredGrid.classList.add('is-active');
            items.forEach(i => i.classList.remove('is-hovered'));
            item.classList.add('is-hovered');
        });
    });

    featuredGrid.addEventListener('mouseleave', () => {
        featuredGrid.classList.remove('is-active');
        items.forEach(item => item.classList.remove('is-hovered'));
    });
}

// Contact form handling
function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real implementation, you'd send this data to a server
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // For demo purposes, just log the data and show a success message
        console.log('Form data:', formData);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
        
        contactForm.innerHTML = '';
        contactForm.appendChild(successMessage);
    });
}

// Add animations to elements
function initializeAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Create a reusable animation observer
    const createAnimationObserver = (selector, staggerDelay = 0) => {
        const elements = document.querySelectorAll(selector);
        
        // Pre-set elements to be hidden initially
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        });
        
        // Observer for animation
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Fade in the element
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements with a staggered delay if needed
        elements.forEach((el, index) => {
            setTimeout(() => {
                observer.observe(el);
            }, index * staggerDelay);
        });
    };
    
    // Animate all sections
    createAnimationObserver('section', 0);
    
    // Animate categories with staggered delay
    createAnimationObserver('.category', 100);
    
    // Animate skill items with staggered delay
    createAnimationObserver('.skill .software-item, .software-item', 50);
} 