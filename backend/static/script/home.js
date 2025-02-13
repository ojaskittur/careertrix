// Scroll to the top when the logo is clicked
document.querySelector('.logo-link').addEventListener('click', function(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Handle header appearance/disappearance on scroll
let lastScrollTop = 0;
const shellBar = document.getElementById('shell-bar');

window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        shellBar.style.top = '-70px'; // Scroll down, hide header
    } else {
        shellBar.style.top = '0'; // Scroll up, show header
    }
    lastScrollTop = scrollTop;
});

// Fade-in and fade-out effect
const fadeInElements = document.querySelectorAll('.fade-in');

const checkFade = () => {
    const triggerBottom = window.innerHeight * 0.855; // Adjust the trigger to be closer to the viewport bottom

    fadeInElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        // Fade-in if element is in view, fade-out if not
        if (elementTop < triggerBottom && elementBottom > 0) {
            element.classList.add('fade-in-active');
        } else {
            element.classList.remove('fade-in-active');
        }
    });
};

window.addEventListener('scroll', checkFade);
checkFade(); // Initial check when the page loads

let index = 0,
    interval = 1000;

const rand = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const animate = star => {
  star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
  star.style.setProperty("--star-top", `${rand(-40, 80)}%`);

  star.style.animation = "none";
  star.offsetHeight;
  star.style.animation = "";
}

for(const star of document.getElementsByClassName("magic-star")) {
  setTimeout(() => {
    animate(star);
    
    setInterval(() => animate(star), 1000);
  }, index++ * (interval / 3))
}

// Enhance text effect on the channel link
const enhance = id => {
  const element = document.getElementById(id),
        text = element.innerText.split("");
  
  element.innerText = "";
  
  text.forEach((value, index) => {
    const outer = document.createElement("span");
    outer.className = "outer";
    
    const inner = document.createElement("span");
    inner.className = "inner";
    inner.style.animationDelay = `${rand(-5000, 0)}ms`;
    
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.innerText = value;
    letter.style.animationDelay = `${index * 1000 }ms`;
    
    inner.appendChild(letter);    
    outer.appendChild(inner);    
    element.appendChild(outer);
  });
}

enhance("channel-link");

// Mobile Menu Functionality
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.querySelector('.navbar');
let isMenuOpen = false;

// Function to close menu
const closeMenu = () => {
    navbar.classList.remove('active');
    mobileMenu.querySelector('i').classList.replace('fa-times', 'fa-bars');
    isMenuOpen = false;
    document.body.style.overflow = ''; // Re-enable scrolling
};

// Function to open menu
const openMenu = () => {
    navbar.classList.add('active');
    mobileMenu.querySelector('i').classList.replace('fa-bars', 'fa-times');
    isMenuOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

// Toggle menu
mobileMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMenuOpen && !navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMenu();
    }
});

// Close menu when clicking nav links
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            closeMenu();
        }
    });
});

// Handle resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMenu();
        }
    }, 250);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 60;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced scroll performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (window.innerWidth <= 768) {
                // Handle header visibility
                const currentScroll = window.pageYOffset;
                if (currentScroll > lastScrollTop && currentScroll > 50) {
                    document.getElementById('shell-bar').style.transform = 'translateY(-100%)';
                } else {
                    document.getElementById('shell-bar').style.transform = 'translateY(0)';
                }
                lastScrollTop = currentScroll;
            }
            ticking = false;
        });
        ticking = true;
    }
});