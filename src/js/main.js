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

// Replace featured works hover logic with grid/accordion logic
if (featuredGrid) {
    const items = featuredGrid.querySelectorAll('.featured-item');
    let lastActiveIndex = 0; // Variable to store the index of the last active item

    const setIndex = (event) => {
        const closest = event.target.closest('.featured-item');
        if (closest) {
            const index = [...items].indexOf(closest);
            lastActiveIndex = index; // Store the current active index

            // Toggle .is-active class on the grid when an item is hovered/clicked
            featuredGrid.classList.add('is-active');

            items.forEach((item, i) => {
                item.dataset.active = (index === i).toString();
                // Toggle .is-hovered class on the currently hovered/clicked item
                item.classList.toggle('is-hovered', index === i);
                // Remove .is-default-open class on hover/click
                item.classList.remove('is-default-open');
            });

            const cols = new Array(items.length)
                .fill()
                .map((_, i) => {
                    return index === i ? '10fr' : '1fr';
                })
                .join(' ');
            featuredGrid.style.setProperty('grid-template-columns', cols);
        }
    };
    featuredGrid.addEventListener('focus', setIndex, true);
    featuredGrid.addEventListener('click', setIndex);
    featuredGrid.addEventListener('pointermove', setIndex);

    // Add event listener for mouseleave to remove classes and reset grid
    featuredGrid.addEventListener('mouseleave', () => {
        featuredGrid.classList.remove('is-active');
        items.forEach((item, i) => {
            item.classList.remove('is-hovered');
            item.classList.remove('is-default-open'); // Ensure default is removed on mouseleave
            item.dataset.active = 'false';
        });
        // Re-apply is-default-open to the last active item after mouseleave
         items.forEach((item, i) => {
            if (i === lastActiveIndex) { // Use lastActiveIndex here
                item.classList.add('is-default-open');
                 item.dataset.active = 'true';
            } else {
                 item.dataset.active = 'false';
            }
         });
         // Recalculate grid columns based on lastActiveIndex
         const cols = new Array(items.length)
                .fill()
                .map((_, i) => {
                    return i === lastActiveIndex ? '10fr' : '1fr'; // Use lastActiveIndex here
                })
                .join(' ');
         featuredGrid.style.setProperty('grid-template-columns', cols);
    });

    const resync = () => {
        const w = Math.max(
            ...[...items].map((i) => {
                return i.offsetWidth;
            })
        );
        featuredGrid.style.setProperty('--article-width', w);
    };
    window.addEventListener('resize', resync);
    resync();
    // Set initial state
    items.forEach((item, i) => {
        item.dataset.active = i === 0 ? 'true' : 'false';
        if (i === 0) {
            item.classList.add('is-default-open');
        }
    });
    featuredGrid.style.setProperty('grid-template-columns', ['10fr'].concat(new Array(items.length - 1).fill('1fr')).join(' '));
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