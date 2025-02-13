document.addEventListener("DOMContentLoaded", function() {
  // Utility function for random numbers
  const rand = (min, max) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Handle magic star animations
  const animateStars = () => {
    let index = 0;
    const interval = 1000;

    const animate = star => {
      star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
      star.style.setProperty("--star-top", `${rand(-40, 80)}%`);
      star.style.animation = "none";
      star.offsetHeight;
      star.style.animation = "";
    };

    const stars = document.getElementsByClassName("magic-star");
    for (const star of stars) {
      setTimeout(() => {
        animate(star);
        setInterval(() => animate(star), 10000);
      }, index++ * (interval / 3));
    }
  };

  // Handle link hover effects
  const setupLinkEffects = () => {
    const links = document.getElementsByClassName("link");
    if (links.length > 0) {
      for (const link of links) {
        link.onmousemove = e => {
          const decimal = e.clientX / link.offsetWidth;
          const basePercent = 80,
            percentRange = 20,
            adjustablePercent = percentRange * decimal;

          const lightBluePercent = basePercent + adjustablePercent;
          link.style.setProperty("--light-blue-percent", `${lightBluePercent}%`);
        };
      }
    }
  };

  // Handle trending jobs hover effects
  const setupTrendingJobs = () => {
    const trendingJobs = document.getElementById("trending-jobs");
    if (trendingJobs) {
      trendingJobs.onmousemove = e => {
        const cards = document.getElementsByClassName("job-card");
        for (const card of cards) {
          const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        }
      };
    }
  };

  // Setup mobile dropdown menu
  const setupMobileMenu = () => {
    const profileUser = document.getElementById("profile-user");
    if (!profileUser) return;

    const dropdown = document.createElement("div");
    dropdown.classList.add("profile-dropdown");
    
    dropdown.innerHTML = `
          <a href="{% url 'home' %}" style="margin-left:30px; margin-bottom:5px;" >
        <i class="fas fa-home"></i> Home
      </a>
      <a href="{% url 'profile' %}" style="margin-left:30px; margin-bottom:5px;" >
        <i class="fas fa-gear"></i> Register
      </a>
      <a href="{% url 'signout' %}" style="margin-left:30px; margin-bottom:5px;" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </a>
    `;
    
    profileUser.parentNode.insertBefore(dropdown, profileUser.nextSibling);

    profileUser.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle("active");
    });

    document.addEventListener("click", function(e) {
      if (!dropdown.contains(e.target) && e.target !== profileUser) {
        dropdown.classList.remove("active");
      }
    });
  };

  // Setup bottom navigation active states
  const setupBottomNav = () => {
    const links = document.querySelectorAll('.side-nav .link');
    const sections = document.querySelectorAll('.section-box');

    links.forEach(link => {
      link.addEventListener('click', function() {
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });

    window.addEventListener('scroll', function() {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
          current = section.getAttribute('id');
        }
      });

      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
    });
  };

  // Initialize all functionality
  animateStars();
  setupLinkEffects();
  setupTrendingJobs();
  setupMobileMenu();
  setupBottomNav();
});
