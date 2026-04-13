  document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.querySelector(".menu-overlay");
  const links = document.querySelectorAll(".nav-links a");

  if (!hamburger || !navLinks || !overlay) return;

  const toggleMenu = () => {
    const isActive = navLinks.classList.toggle("active");
    hamburger.classList.toggle("open", isActive);
    hamburger.classList.toggle("active", isActive);
    overlay.classList.toggle("active", isActive);
    document.body.classList.toggle("menu-open", isActive);
  };

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("open", "active");
      overlay.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });

  overlay.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamburger.classList.remove("open", "active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navLinks.classList.remove("active");
      hamburger.classList.remove("open", "active");
      overlay.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });
});


// --- Advisory Board Slideshow (for about.html) ---
let slideIndex = 0;

function showAdvisorySlides() {
  const slides = document.querySelectorAll(".advisory-card");
  if (slides.length === 0) return;

  slides.forEach(slide => {
    slide.style.display = "none";
    slide.classList.remove("active");
  });

  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;

  slides[slideIndex - 1].style.display = "block";
  slides[slideIndex - 1].classList.add("active");

  setTimeout(showAdvisorySlides, 3000); // 3s per slide
}

window.addEventListener("load", showAdvisorySlides);

// --- Event Tabs Functionality (for events.html) ---
// --- Function to check event count and toggle 'no-data' class ---
function updateEventContainerState(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    // We check the event-card-list container inside the tab

    const eventList = container.querySelector('.event-card-list');
    // Check how many actual event cards are present (assuming .event-card is the template)
    // If the eventList container exists, count its children (the event cards)

    const eventCount = eventList ? eventList.querySelectorAll('.event-card').length : 0;

    if (eventCount === 0) {
        // If there are no event cards, add the 'no-data' class.
        // CSS will hide the empty event list and show the 'No Data' message.

        container.classList.add('no-data');
    } else {
        // If there are events, remove the 'no-data' class.
        // CSS will show the event list and hide the 'No Data' message.

        container.classList.remove('no-data');
    }
}


// --- Event Filtering Function (Original, with update added) ---
function filterEvents(category) {
    // 1. Get all content elements (Upcoming, Completed)
    const contents = document.querySelectorAll('.event-tab-content');
    
    // 2. Hide all content elements
    contents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });

    // 3. Show the selected content
    const selectedContent = document.getElementById(category);
    if (selectedContent) {
        selectedContent.style.display = 'block';
        selectedContent.classList.add('active');
        
        // **NEW INTEGRATION:** Check the content status after switching the tab
        updateEventContainerState(category);
    }

    // 4. Update the active state of the buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Find the active button
    const activeButton = Array.from(buttons).find(
        button => button.getAttribute('onclick') === `filterEvents('${category}')`
    );

    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Initial call to set the 'upcoming' tab as active on load
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the hamburger menu script is still here (if it was)
    // ... (your existing hamburger script code)

    // Run the filter function to show 'upcoming' by default
    filterEvents('upcoming');
    
    // Note: The call to filterEvents('upcoming') already includes 
    // updateEventContainerState('upcoming'), so no extra call is needed here.
});


// Hero Slideshow functionality
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  
  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('fade'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('fade');
  }
  
  // Auto-advance slides every 3 seconds
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 3000);
}


// --- Social Media Section Slider with Swipe and Buttons ---
function initSocialMediaSliders() {
  console.log("Initializing social media sliders with swipe functionality and buttons...");
  
  // Reels Slider
  const reelsTrack = document.querySelector('.reels-track');
  const reelsPrev = document.querySelector('.reels-prev');
  const reelsNext = document.querySelector('.reels-next');
  
  // Podcasts Slider
  const podcastTrack = document.querySelector('.podcasts-track');
  const podcastsPrev = document.querySelector('.podcasts-prev');
  const podcastsNext = document.querySelector('.podcasts-next');
  
  // Initialize if elements exist
  if (reelsTrack && reelsPrev && reelsNext) {
    initSocialSlider({
      track: reelsTrack,
      prevBtn: reelsPrev,
      nextBtn: reelsNext,
      itemSelector: '.reel-item',
      itemWidth: 280,
      gap: 24,
      visibleItems: { desktop: 4, tablet: 2, mobile: 1 }
    });
  }
  
  if (podcastTrack && podcastsPrev && podcastsNext) {
    initSocialSlider({
      track: podcastTrack,
      prevBtn: podcastsPrev,
      nextBtn: podcastsNext,
      itemSelector: '.podcast-item',
      itemWidth: 560,
      gap: 24,
      visibleItems: { desktop: 2, tablet: 1, mobile: 1 }
    });
  }
}

function initSocialSlider(config) {
  const {
    track,
    prevBtn,
    nextBtn,
    itemSelector,
    itemWidth,
    gap,
    visibleItems
  } = config;
  
  let position = 0;
  let isDragging = false;
  let startPos = 0;
  let prevTranslate = 0;
  
  const items = track.querySelectorAll(itemSelector);
  let visibleCount = 3;
  let itemFullWidth = 0;

  function updateSliderSettings() {
    if (window.innerWidth <= 480) {
      visibleCount = visibleItems.mobile;
      itemFullWidth = items[0].offsetWidth + 20;
    } else if (window.innerWidth <= 768) {
      visibleCount = visibleItems.tablet;
      itemFullWidth = items[0].offsetWidth + 32;
    } else if (window.innerWidth <= 1024) {
      visibleCount = visibleItems.desktop;
      itemFullWidth = items[0].offsetWidth + 32;
    } else {
      visibleCount = visibleItems.desktop;
      itemFullWidth = items[0].offsetWidth + 32;
    }
  }

  function moveSlide(direction) {
    updateSliderSettings();
    const maxPosition = -itemFullWidth * (items.length - visibleCount);
    
    if (direction === 'next') {
      position = Math.max(position - (itemFullWidth * visibleCount), maxPosition);
    } else {
      position = Math.min(position + (itemFullWidth * visibleCount), 0);
    }
    
    track.style.transform = `translateX(${position}px)`;
    prevTranslate = position;
    updateButtonStates();
  }

  function updateButtonStates() {
    const maxPosition = -itemFullWidth * (items.length - visibleCount);
    
    // Disable buttons when at boundaries
    if (prevBtn && nextBtn) {
      prevBtn.style.opacity = position < 0 ? '1' : '0.5';
      prevBtn.style.pointerEvents = position < 0 ? 'auto' : 'none';
      
      nextBtn.style.opacity = position > maxPosition ? '1' : '0.5';
      nextBtn.style.pointerEvents = position > maxPosition ? 'auto' : 'none';
    }
  }

  // Touch/Mouse Events
  function touchStart(e) {
    isDragging = true;
    startPos = getPositionX(e);
    track.style.cursor = 'grabbing';
    track.style.transition = 'none';
  }

  function touchMove(e) {
    if (!isDragging) return;
    const currentPosition = getPositionX(e);
    const diff = currentPosition - startPos;
    position = prevTranslate + diff;
    track.style.transform = `translateX(${position}px)`;
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    track.style.transition = 'transform 0.5s ease';
    
    const movedBy = position - prevTranslate;
    updateSliderSettings();
    
    if (movedBy < -50) {
      // Swipe left - next
      moveSlide('next');
    } else if (movedBy > 50) {
      // Swipe right - previous
      moveSlide('prev');
    } else {
      // Return to original position
      track.style.transform = `translateX(${prevTranslate}px)`;
      position = prevTranslate;
    }
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  // Event Listeners for buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => moveSlide('prev'));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => moveSlide('next'));
  }

  // Event Listeners for touch and mouse
  track.addEventListener('mousedown', touchStart);
  track.addEventListener('touchstart', touchStart);
  
  track.addEventListener('mousemove', touchMove);
  track.addEventListener('touchmove', touchMove);
  
  track.addEventListener('mouseup', touchEnd);
  track.addEventListener('mouseleave', touchEnd);
  track.addEventListener('touchend', touchEnd);

  // Initialize
  updateSliderSettings();
  track.style.transform = `translateX(${position}px)`;
  prevTranslate = position;
  updateButtonStates();

  // Update on resize
  window.addEventListener('resize', () => {
    updateSliderSettings();
    position = 0;
    prevTranslate = 0;
    track.style.transform = `translateX(${position}px)`;
    updateButtonStates();
  });
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initSocialMediaSliders();
});

// Fallback initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSocialMediaSliders);
} else {
  setTimeout(initSocialMediaSliders, 100);
}

// Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded, initializing components...");
  initHeroSlideshow();
  initSocialMediaSliders();
});

// Fallback initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initHeroSlideshow();
    initSocialMediaSliders();
  });
} else {
  // DOM is already ready
  setTimeout(() => {
    initHeroSlideshow();
    initSocialMediaSliders();
  }, 100);
}


// --- Blogs Section Slider with Swipe Only ---
function initBlogsSlider() {
  const blogsTrack = document.querySelector('.blogs-track');
  
  if (!blogsTrack) return;
  
  let blogsPosition = 0;
  let blogsAutoSlide;
  let isDragging = false;
  let startPos = 0;
  let prevTranslate = 0;
  
  const blogItems = document.querySelectorAll('.blog-item');
  let visibleBlogs = 2;
  let blogWidth = 0;

  function updateSliderSettings() {
    if (window.innerWidth <= 480) {
      visibleBlogs = 1;
      blogWidth = blogItems[0].offsetWidth + 20;
    } else if (window.innerWidth <= 768) {
      visibleBlogs = 1;
      blogWidth = blogItems[0].offsetWidth + 32;
    } else if (window.innerWidth <= 1024) {
      visibleBlogs = 2;
      blogWidth = blogItems[0].offsetWidth + 32;
    } else {
      visibleBlogs = 2;
      blogWidth = blogItems[0].offsetWidth + 32;
    }
  }

  function moveBlogsSlide(direction) {
    updateSliderSettings();
    const maxPosition = -blogWidth * (blogItems.length - visibleBlogs);
    
    if (direction === 'next') {
      blogsPosition = Math.max(blogsPosition - (blogWidth * visibleBlogs), maxPosition);
    } else {
      blogsPosition = Math.min(blogsPosition + (blogWidth * visibleBlogs), 0);
    }
    
    blogsTrack.style.transform = `translateX(${blogsPosition}px)`;
    prevTranslate = blogsPosition;
    resetBlogsAutoSlide();
  }

  function startBlogsAutoSlide() {
    blogsAutoSlide = setInterval(() => {
      updateSliderSettings();
      const maxPosition = -blogWidth * (blogItems.length - visibleBlogs);
      
      if (blogsPosition <= maxPosition) {
        blogsPosition = 0;
      } else {
        blogsPosition = Math.max(blogsPosition - (blogWidth * visibleBlogs), maxPosition);
      }
      
      blogsTrack.style.transform = `translateX(${blogsPosition}px)`;
      prevTranslate = blogsPosition;
    }, 5000);
  }

  function resetBlogsAutoSlide() {
    clearInterval(blogsAutoSlide);
    startBlogsAutoSlide();
  }

  // Touch/Mouse Events
  function touchStart(e) {
    isDragging = true;
    startPos = getPositionX(e);
    blogsTrack.style.cursor = 'grabbing';
    blogsTrack.style.transition = 'none';
    resetBlogsAutoSlide();
  }

  function touchMove(e) {
    if (!isDragging) return;
    const currentPosition = getPositionX(e);
    const diff = currentPosition - startPos;
    blogsPosition = prevTranslate + diff;
    blogsTrack.style.transform = `translateX(${blogsPosition}px)`;
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    blogsTrack.style.cursor = 'grab';
    blogsTrack.style.transition = 'transform 0.5s ease';
    
    const movedBy = blogsPosition - prevTranslate;
    updateSliderSettings();
    
    if (movedBy < -50) {
      // Swipe left - next
      moveBlogsSlide('next');
    } else if (movedBy > 50) {
      // Swipe right - previous
      moveBlogsSlide('prev');
    } else {
      // Return to original position
      blogsTrack.style.transform = `translateX(${prevTranslate}px)`;
      blogsPosition = prevTranslate;
    }
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  // Event Listeners for touch and mouse
  blogsTrack.addEventListener('mousedown', touchStart);
  blogsTrack.addEventListener('touchstart', touchStart);
  
  blogsTrack.addEventListener('mousemove', touchMove);
  blogsTrack.addEventListener('touchmove', touchMove);
  
  blogsTrack.addEventListener('mouseup', touchEnd);
  blogsTrack.addEventListener('mouseleave', touchEnd);
  blogsTrack.addEventListener('touchend', touchEnd);

  // Initialize
  updateSliderSettings();
  blogsTrack.style.transform = `translateX(${blogsPosition}px)`;
  prevTranslate = blogsPosition;
  startBlogsAutoSlide();

  // Update on resize
  window.addEventListener('resize', () => {
    updateSliderSettings();
    blogsPosition = 0;
    prevTranslate = 0;
    blogsTrack.style.transform = `translateX(${blogsPosition}px)`;
  });
}


// --- Testimonials Section Slider with Swipe Only ---
function initTestimonialsSlider() {
  const testimonialsTrack = document.querySelector('.testimonials-track');
  
  if (!testimonialsTrack) return;
  
  let testimonialsPosition = 0;
  let testimonialsAutoSlide;
  let isDragging = false;
  let startPos = 0;
  let prevTranslate = 0;
  
  const testimonialItems = document.querySelectorAll('.testimonial-item');
  let visibleTestimonials = 3;
  let testimonialWidth = 0;

  function updateSliderSettings() {
    if (window.innerWidth <= 480) {
      visibleTestimonials = 1;
      testimonialWidth = testimonialItems[0].offsetWidth + 20;
    } else if (window.innerWidth <= 768) {
      visibleTestimonials = 1;
      testimonialWidth = testimonialItems[0].offsetWidth + 32;
    } else if (window.innerWidth <= 1024) {
      visibleTestimonials = 2;
      testimonialWidth = testimonialItems[0].offsetWidth + 32;
    } else {
      visibleTestimonials = 3;
      testimonialWidth = testimonialItems[0].offsetWidth + 32;
    }
  }

  function moveTestimonialsSlide(direction) {
    updateSliderSettings();
    const maxPosition = -testimonialWidth * (testimonialItems.length - visibleTestimonials);
    
    if (direction === 'next') {
      testimonialsPosition = Math.max(testimonialsPosition - (testimonialWidth * visibleTestimonials), maxPosition);
    } else {
      testimonialsPosition = Math.min(testimonialsPosition + (testimonialWidth * visibleTestimonials), 0);
    }
    
    testimonialsTrack.style.transform = `translateX(${testimonialsPosition}px)`;
    prevTranslate = testimonialsPosition;
    resetTestimonialsAutoSlide();
  }

  function startTestimonialsAutoSlide() {
    testimonialsAutoSlide = setInterval(() => {
      updateSliderSettings();
      const maxPosition = -testimonialWidth * (testimonialItems.length - visibleTestimonials);
      
      if (testimonialsPosition <= maxPosition) {
        testimonialsPosition = 0;
      } else {
        testimonialsPosition = Math.max(testimonialsPosition - (testimonialWidth * visibleTestimonials), maxPosition);
      }
      
      testimonialsTrack.style.transform = `translateX(${testimonialsPosition}px)`;
      prevTranslate = testimonialsPosition;
    }, 5000);
  }

  function resetTestimonialsAutoSlide() {
    clearInterval(testimonialsAutoSlide);
    startTestimonialsAutoSlide();
  }

  // Touch/Mouse Events
  function touchStart(e) {
    isDragging = true;
    startPos = getPositionX(e);
    testimonialsTrack.style.cursor = 'grabbing';
    testimonialsTrack.style.transition = 'none';
    resetTestimonialsAutoSlide();
  }

  function touchMove(e) {
    if (!isDragging) return;
    const currentPosition = getPositionX(e);
    const diff = currentPosition - startPos;
    testimonialsPosition = prevTranslate + diff;
    testimonialsTrack.style.transform = `translateX(${testimonialsPosition}px)`;
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    testimonialsTrack.style.cursor = 'grab';
    testimonialsTrack.style.transition = 'transform 0.5s ease';
    
    const movedBy = testimonialsPosition - prevTranslate;
    updateSliderSettings();
    
    if (movedBy < -50) {
      // Swipe left - next
      moveTestimonialsSlide('next');
    } else if (movedBy > 50) {
      // Swipe right - previous
      moveTestimonialsSlide('prev');
    } else {
      // Return to original position
      testimonialsTrack.style.transform = `translateX(${prevTranslate}px)`;
      testimonialsPosition = prevTranslate;
    }
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  // Event Listeners for touch and mouse
  testimonialsTrack.addEventListener('mousedown', touchStart);
  testimonialsTrack.addEventListener('touchstart', touchStart);
  
  testimonialsTrack.addEventListener('mousemove', touchMove);
  testimonialsTrack.addEventListener('touchmove', touchMove);
  
  testimonialsTrack.addEventListener('mouseup', touchEnd);
  testimonialsTrack.addEventListener('mouseleave', touchEnd);
  testimonialsTrack.addEventListener('touchend', touchEnd);

  // Initialize
  updateSliderSettings();
  testimonialsTrack.style.transform = `translateX(${testimonialsPosition}px)`;
  prevTranslate = testimonialsPosition;
  startTestimonialsAutoSlide();

  // Update on resize
  window.addEventListener('resize', () => {
    updateSliderSettings();
    testimonialsPosition = 0;
    prevTranslate = 0;
    testimonialsTrack.style.transform = `translateX(${testimonialsPosition}px)`;
  });
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initBlogsSlider();
  initTestimonialsSlider();
});


// Script for counselling.html page
function setEqualCardHeight() {
    const cards = document.querySelectorAll(".expert-card");
    let maxHeight = 0;

    // reset height
    cards.forEach(card => card.style.height = 'auto');

    // find max height
    cards.forEach(card => {
        if(card.offsetHeight > maxHeight) maxHeight = card.offsetHeight;
    });

    // set all cards to max height
    cards.forEach(card => card.style.height = maxHeight + "px");
}

// run on page load and window resize
window.addEventListener("load", setEqualCardHeight);
window.addEventListener("resize", setEqualCardHeight);


// Scroll Animation
 document.addEventListener("DOMContentLoaded", () => {
  const planCards = document.querySelectorAll(".plan-card");
  const points = document.querySelectorAll(".counselling-points li");
  const expertCards = document.querySelectorAll(".expert-card");
  const timelineItems = document.querySelectorAll(".timeline-item"); // 👈 Added
  const aboutp= document.querySelectorAll(".about p"); // 👈 Added


  // Helper function to check if element is in viewport
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.85; // 85% visible
  }

  // Animate elements on scroll
  let lineShown = false; // ensure line only appears once

  function animateOnScroll() {
    planCards.forEach((card, index) => {
      if (isInViewport(card) && !card.classList.contains("animate")) {
        setTimeout(() => card.classList.add("animate"), index * 200);
      }
    });

    points.forEach((point, index) => {
      if (isInViewport(point) && !point.classList.contains("animate")) {
        setTimeout(() => point.classList.add("animate"), index * 150);
      }
    });

    expertCards.forEach((card, index) => {
      if (isInViewport(card) && !card.classList.contains("animate")) {
        setTimeout(() => card.classList.add("animate"), index * 200);
      }
    });
    
    aboutp.forEach((item, index) => {
       if (isInViewport(item) && !item.classList.contains("animate")) {
         setTimeout(() => item.classList.add("animate"), index * 200);
     }
});
    timelineItems.forEach((item, index) => {
       if (isInViewport(item) && !item.classList.contains("animate")) {
         setTimeout(() => item.classList.add("animate"), index * 200);
     }
});


 // 🌟 Once all timeline items animate, fade in the vertical line
  if (!lineShown) {
    const allAnimated = [...timelineItems].every(item =>
      item.classList.contains("animate")
    );

    if (allAnimated) {
      const timeline = document.querySelector(".timeline");
      if (timeline) {
        // Wait slightly longer than your animation (0.6s) before showing line
        setTimeout(() => {
          timeline.style.setProperty("--line-opacity", "1");
        }, 700); // (0.6s animation + 0.1s buffer)
      }
      lineShown = true;
    }
  }


  }

  // Trigger animation once on first scroll
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Trigger on load in case already in viewport
});