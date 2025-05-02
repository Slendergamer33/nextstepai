// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const resumeForm = document.getElementById('resume-form');
const fileInput = document.getElementById('resume-upload');
const fileNameDisplay = document.getElementById('file-name');
const loadingContainer = document.getElementById('loading');
const resultsContainer = document.getElementById('results-container');
const navbarLinks = document.querySelectorAll('.nav-link');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme
if (currentTheme === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
  document.body.classList.add('dark-mode');
  currentTheme = 'dark';
} else {
  document.body.classList.remove('dark-mode');
  currentTheme = 'light';
}

// Theme toggle function
function toggleTheme() {
  if (currentTheme === 'light') {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    currentTheme = 'dark';
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    currentTheme = 'light';
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  mobileMenuBtn.classList.toggle('active');
  mobileMenu.classList.toggle('active');
}

// Smooth scrolling for navigation links
function smoothScroll(e, id) {
  e.preventDefault();
  const element = document.getElementById(id);
  
  if (element) {
    // Close mobile menu if open
    if (mobileMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
    
    const yOffset = -70; // Account for fixed header
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}

// File upload handling
function handleFileInputChange() {
  const fileName = fileInput.files[0]?.name || 'No file chosen';
  fileNameDisplay.textContent = fileName;
  
  // Clear any previous error
  document.getElementById('resume-upload-error').textContent = '';
}

// Form validation
function validateForm() {
  let isValid = true;
  
  // Job title validation
  const jobTitle = document.getElementById('job-title').value.trim();
  const jobTitleError = document.getElementById('job-title-error');
  
  if (!jobTitle) {
    jobTitleError.textContent = 'Job title is required';
    isValid = false;
  } else {
    jobTitleError.textContent = '';
  }
  
  // Skills validation
  const skills = document.getElementById('required-skills').value.trim();
  const skillsError = document.getElementById('required-skills-error');
  
  if (!skills) {
    skillsError.textContent = 'At least one required skill is needed';
    isValid = false;
  } else {
    skillsError.textContent = '';
  }
  
  // File upload validation
  const file = fileInput.files[0];
  const fileError = document.getElementById('resume-upload-error');
  
  if (!file) {
    fileError.textContent = 'Please upload a CSV file';
    isValid = false;
  } else if (!file.name.toLowerCase().endsWith('.csv')) {
    fileError.textContent = 'Please upload a valid CSV file';
    isValid = false;
  } else {
    fileError.textContent = '';
  }
  
  return isValid;
}

// Process form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  if (validateForm()) {
    // Show loading state
    resumeForm.style.display = 'none';
    loadingContainer.style.display = 'flex';
    
    // Get form data
    const jobTitle = document.getElementById('job-title').value.trim();
    const skills = document.getElementById('required-skills').value.trim().split(',').map(skill => skill.trim());
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Hide loading
      loadingContainer.style.display = 'none';
      
      // Generate and display mock results
      generateMockResults(jobTitle, skills);
      
      // Show results
      resultsContainer.style.display = 'flex';
      
      // Scroll to results section
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Reset form but keep it hidden until user wants to do another search
      resumeForm.reset();
      fileNameDisplay.textContent = 'No file chosen';
    }, 2500);
  }
}

// Generate mock results for demonstration
function generateMockResults(jobTitle, skills) {
  // Clear previous results
  resultsContainer.innerHTML = '';
  
  // Mock candidate data
  const candidates = [
    {
      name: 'Alex Johnson',
      match: 95,
      experience: '8 years',
      education: 'Master in Computer Science',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS']
    },
    {
      name: 'Morgan Smith',
      match: 87,
      experience: '6 years',
      education: 'Bachelor in Software Engineering',
      skills: ['JavaScript', 'React', 'Vue.js', 'Java', 'Docker']
    },
    {
      name: 'Taylor Wilson',
      match: 82,
      experience: '5 years',
      education: 'Bachelor in Computer Science',
      skills: ['JavaScript', 'Angular', 'Node.js', 'C#', 'MongoDB']
    },
    {
      name: 'Jordan Lee',
      match: 78,
      experience: '4 years',
      education: 'Bachelor in Information Technology',
      skills: ['JavaScript', 'React', 'PHP', 'MySQL', 'Laravel']
    }
  ];
  
  // Create and append candidate cards with animation delay
  candidates.forEach((candidate, index) => {
    // Filter skills that match the required skills
    const matchingSkills = candidate.skills.filter(skill => 
      skills.some(requiredSkill => 
        skill.toLowerCase().includes(requiredSkill.toLowerCase())
      )
    );
    
    // Create candidate card
    const card = document.createElement('div');
    card.className = 'candidate-card';
    card.style.animationDelay = `${index * 0.2}s`;
    
    // Create candidate header
    const header = document.createElement('div');
    header.className = 'candidate-header';
    header.innerHTML = `
      <div class="candidate-name">${candidate.name}</div>
      <div class="candidate-match">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="candidate-match-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        ${candidate.match}% Match
      </div>
    `;
    
    // Create candidate body
    const body = document.createElement('div');
    body.className = 'candidate-body';
    body.innerHTML = `
      <div class="candidate-info">
        <h4>Experience</h4>
        <p>${candidate.experience}</p>
      </div>
      
      <div class="candidate-info">
        <h4>Education</h4>
        <p>${candidate.education}</p>
      </div>
      
      <div class="candidate-info">
        <h4>Skills</h4>
        <div class="skills-list">
          ${candidate.skills.map(skill => `
            <span class="skill-tag ${matchingSkills.includes(skill) ? 'matching' : ''}">${skill}</span>
          `).join('')}
        </div>
      </div>
    `;
    
    // Create candidate footer
    const footer = document.createElement('div');
    footer.className = 'candidate-footer';
    footer.innerHTML = `
      <button class="btn btn-secondary">View Details</button>
    `;
    
    // Append all sections to card
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);
    
    // Append card to results container
    resultsContainer.appendChild(card);
  });
}

// Scroll event handling for navbar
function handleScroll() {
  const scrollPosition = window.scrollY;
  const navbar = document.querySelector('.navbar');
  
  if (scrollPosition > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// Set up intersection observer for animations
function setupAnimations() {
  const animatedElements = document.querySelectorAll('.animate-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `fadeIn 0.8s ease forwards`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Mobile menu
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  
  // Mobile nav links
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href').substring(1);
      smoothScroll(e, href);
    });
  });
  
  // Desktop nav links
  navbarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href').substring(1);
      smoothScroll(e, href);
    });
  });
  
  // File input
  fileInput.addEventListener('change', handleFileInputChange);
  
  // Form submission
  resumeForm.addEventListener('submit', handleFormSubmit);
  
  // Scroll event
  window.addEventListener('scroll', handleScroll);
  
  // Set up animations
  setupAnimations();
});

// Reset button to show form again (for demo purposes)
document.querySelector('.btn-secondary')?.addEventListener('click', () => {
  resultsContainer.style.display = 'none';
  resumeForm.style.display = 'block';
});