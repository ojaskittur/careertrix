// Global event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupBottomNav();
  setupMouseEffects();
});

// Mobile dropdown menu setup
const setupMobileMenu = () => {
  const profileUser = document.getElementById("profile-user");
  if (!profileUser) return;

  const dropdown = document.createElement("div");
  dropdown.classList.add("profile-dropdown");
  
  dropdown.innerHTML = `
    <a href="{% url 'profile' %}" style="margin-left:30px; margin-bottom:5px;" >
        <i class="fas fa-user"></i> Profile
      </a>
      <a href="{% url 'register' %}" style="margin-left:30px; margin-bottom:5px;" >
        <i class="fas fa-gear"></i> Register
      </a>
      <a href="{% url 'signout' %}" style="margin-left:30px; margin-bottom:5px;" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </a>
  `;
  
  profileUser.parentNode.insertBefore(dropdown, profileUser.nextSibling);

  // Toggle dropdown on profile click
  profileUser.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== profileUser) {
      dropdown.classList.remove("active");
    }
  });
};

// Bottom navigation setup
const setupBottomNav = () => {
  const links = document.querySelectorAll('.side-nav .link');
  const sections = document.querySelectorAll('.section-box');

  // Handle click events on navigation links
  links.forEach(link => {
    link.addEventListener('click', function() {
      links.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Handle scroll events for active section highlighting
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 60) {
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

// Mouse effects setup
const setupMouseEffects = () => {
  // Link hover effects
  const links = document.getElementsByClassName("link");
  if (links.length > 0) {
    for (const link of links) {
      link.onmousemove = e => {
        const decimal = e.clientX / link.offsetWidth;
        const basePercent = 80;
        const percentRange = 20;
        const adjustablePercent = percentRange * decimal;
        const lightBluePercent = basePercent + adjustablePercent;
        link.style.setProperty("--light-blue-percent", `${lightBluePercent}%`);
      };
    }
  }

  // Cards hover effect
  const cards = document.getElementById("cards");
  if (cards) {
    cards.onmousemove = e => {
      for (const card of document.getElementsByClassName("card")) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };
  }
};

// Generate button event handler
const setupGenerateButton = () => {
  const generateButton = document.getElementById("generate-button");
  if (!generateButton) return;

  generateButton.addEventListener("click", () => {
    const outputMessage = document.getElementById("output-message");
    const placeholderMessage = document.getElementById("placeholder-message");
    const iframe = document.getElementById("output-iframe");
    const roadmapSection = document.getElementById("roadmap-section");
    
    const jobSelected = document.getElementById("job-dropdown").value;
    const skillsSelected = document.getElementById("skills-dropdown").value;
  
    if (jobSelected !== "Select Option" && skillsSelected !== "Select Option") {
      const iframeURL = `test.html?job=${jobSelected}&skills=${skillsSelected}`;
      
      iframe.src = iframeURL;
      outputMessage.style.display = "block";
      iframe.style.display = "block";
      placeholderMessage.style.display = "none";
      roadmapSection.style.display = "block";
    } else {
      alert("Please select both a job and a skill.");
    }
  });
};
