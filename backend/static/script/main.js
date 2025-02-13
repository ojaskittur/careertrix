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

  profileUser.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

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

  links.forEach(link => {
    link.addEventListener('click', function() {
      links.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

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

// Function to parse company and role from job title
const parseJobTitle = (title) => {
  const parts = title.split('is hiring');
  return {
    company: parts[0].trim(),
    role: parts[1] ? parts[1].trim() : 'Software Engineer'
  };
};

// Improved function to validate URL
const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Enhanced function to create job card HTML
const createJobCard = (job) => {
  const { company, role } = parseJobTitle(job.title);
  const currentDate = new Date();
  const closingDate = new Date(currentDate);
  closingDate.setDate(currentDate.getDate() + 10);
  
  const jobType = job.text && job.text.toLowerCase().includes("part-time") ? "Part Time" : "Full Time";
  const jobDescriptionPreview = job.text ? job.text.split(" ").slice(0, 7).join(" ") + '...' : 'Apply to learn more';

  // Validate and process the URL
  let jobUrl = '';
  let companyLogo = 'https://cdn-icons-png.flaticon.com/512/10839/10839543.png';
  
  if (isValidUrl(job.url)) {
    jobUrl = job.url;
    try {
      const urlObj = new URL(job.url);
      companyLogo = `https://logo.clearbit.com/${urlObj.hostname}`;
    } catch (e) {
      // Keep default logo if URL parsing fails
    }
  }

  return `
    <div class="card">
      <div class="card-content">
        <div class="card-info-wrapper">
          <div class="card-info">
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
              ${jobUrl ? 
                `<a href="${jobUrl}" target="_blank" rel="noopener noreferrer" class="apply-btn">Apply Now</a>` : 
                `<button class="apply-btn" style="opacity:0.7;cursor:not-allowed" onclick="alert('Application link not available for this position.')">Apply Now</button>`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Enhanced jobs fetching function
const fetchJobs = async () => {
  const cardsContainer = document.getElementById("cards");
  
  try {
    cardsContainer.innerHTML = '<div class="loader">Loading jobs...</div>';
    
    const response = await fetch("https://hacker-news.firebaseio.com/v0/jobstories.json");
    if (!response.ok) throw new Error("Failed to fetch job IDs");

    const jobIds = await response.json();
    const jobPromises = jobIds.map(id => 
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(res => res.json())
        .catch(err => null) // Handle individual job fetch failures gracefully
    );

    const jobs = await Promise.all(jobPromises);
    
    cardsContainer.innerHTML = '';
    
    jobs.forEach(job => {
      if (job && job.title) {
        const cardHTML = createJobCard(job);
        cardsContainer.innerHTML += cardHTML;
      }
    });
    
    setupMouseEffects();
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    cardsContainer.innerHTML = '<div class="error">Failed to load jobs. Please try again later.</div>';
  }
};

// Setup job search functionality
const setupJobsSearch = () => {
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
  
  const cardsSection = document.getElementById('cards').parentElement;
  cardsSection.insertBefore(searchContainer, document.getElementById('cards'));
  
  const searchInput = document.getElementById('jobSearch');
  let debounceTimer;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const searchTerm = e.target.value.toLowerCase();
      const locationFilter = document.getElementById('location-filter').value.toLowerCase();
      const cards = document.querySelectorAll('.card');
      
      cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const matchesSearch = cardText.includes(searchTerm);
        const matchesLocation = locationFilter === '' || cardText.includes(locationFilter);
        card.style.display = (matchesSearch && matchesLocation) ? 'block' : 'none';
      });
    }, 300);
  });

  const locationFilter = document.getElementById("location-filter");
  locationFilter.addEventListener("change", () => {
    const searchTerm = document.getElementById('jobSearch').value.toLowerCase();
    const location = locationFilter.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      const matchesSearch = cardText.includes(searchTerm);
      const matchesLocation = location === "" || cardText.includes(location);
      card.style.display = (matchesSearch && matchesLocation) ? "block" : "none";
    });
  });
};
