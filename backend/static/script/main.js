// Global event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupBottomNav();
  setupMouseEffects();
  setupJobsSearch();
  fetchJobs();
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

// New function to fetch and display jobs
const fetchJobs = async () => {
  const cardsContainer = document.getElementById("cards");
  
  try {
    // Show loading state
    cardsContainer.innerHTML = '<div class="loader">Loading jobs...</div>';
    
    // Fetch job IDs from Hacker News API
    const response = await fetch("https://hacker-news.firebaseio.com/v0/jobstories.json");
    if (!response.ok) throw new Error("Failed to fetch job IDs");

    const jobIds = await response.json();
    const jobPromises = jobIds.map(id => 
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(res => res.json())
      );

    const jobs = await Promise.all(jobPromises);
    
    // Clear loading state and render jobs
    cardsContainer.innerHTML = '';
    
    jobs.forEach(job => {
      if (job && job.title) { // Check if job exists and has title
        const cardHTML = createJobCard(job);
        cardsContainer.innerHTML += cardHTML;
      }
    });
    
    // Reapply mouse effects after adding new cards
    setupMouseEffects();
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    cardsContainer.innerHTML = '<div class="error">Failed to load jobs. Please try again later.</div>';
  }
};

// Function to parse company and role from HN job title
const parseJobTitle = (title) => {
  const parts = title.split('is hiring');
  return {
    company: parts[0].trim(),
    role: parts[1] ? parts[1].trim() : 'Software Engineer' // Default professional role
  };
};

// Function to create job card HTML
const createJobCard = (job) => {
  const { company, role } = parseJobTitle(job.title);
  const currentDate = new Date();
  const closingDate = new Date(currentDate);
  closingDate.setDate(currentDate.getDate() + 10); // Set closing date to 10 days from now
  
  // Determine job type (fallback to "Full Time")
  const jobType = job.text && job.text.toLowerCase().includes("part-time") ? "Part Time" : "Full Time";
  
  // Extract a short preview of job description if available
  const jobDescriptionPreview = job.text ? job.text.split(" ").slice(0, 7).join(" ") + '...' : 'Apply to learn more';

  // Get company logo (fallback to default image)
  const companyLogo = job.url ? `https://logo.clearbit.com/${new URL(job.url).hostname}` : "https://cdn-icons-png.flaticon.com/512/10839/10839543.png";

  return `
    <div class="card">
      <div class="card-content">
        <div class="card-image">
          <i class="fa-duotone fa-apartment"></i>
        </div>
        <div class="card-info-wrapper">
          <div class="card-info">
            <i class="fa-duotone fa-apartment"></i>
            <div class="card-info-title">
              <img
                src="${companyLogo}"
                alt="${company} Logo"
                class="company-logo"
                onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/10839/10839543.png'"
              />
              <h2>${role}</h2>
              <p class="company-name">${company}</p>
              <p class="job-type">${jobType}</p>
              <p class="experience">Posted: ${new Date(job.time * 1000).toLocaleDateString()}</p>
              <p class="closing-date">Application Closing: ${closingDate.toLocaleDateString()}</p>
              <p class="job-description-preview">${jobDescriptionPreview}</p>
              <a href="${job.url}" target="_blank" class="apply-btn">Apply Now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// New function to setup job search
const setupJobsSearch = () => {
  // Add search input to the DOM
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <input 
      type="text" 
      id="jobSearch" 
      placeholder="Search jobs..." 
      class="search-input"
    >
    <select class="filter-select" id="location-filter">
  <option value="">All Locations</option>
  <option value="remote">Remote</option>
  <option value="ind">India</option>
  <option value="us">United States</option>
  <option value="can">Canada</option>
  <option value="au">Australia</option>
  <option value="ger">Germany</option>
  <option value="fra">France</option>
</select>

  `;
  
  // Insert search before the cards container
  const cardsSection = document.getElementById('cards').parentElement;
  cardsSection.insertBefore(searchContainer, document.getElementById('cards'));
  
  // Add search functionality
  const searchInput = document.getElementById('jobSearch');
  let debounceTimer;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const searchTerm = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.card');
      
      cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        card.style.display = cardText.includes(searchTerm) ? 'block' : 'none';
      });
    }, 300);
  });

  // Add location filter functionality
  const locationFilter = document.getElementById("location-filter");
  locationFilter.addEventListener("change", () => {
    const location = locationFilter.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      if (location === "" || text.includes(location)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
};
