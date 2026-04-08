const sidebar = document.querySelector('.sidebar');
const menuToggle = document.getElementById('menuToggle');
const faders = document.querySelectorAll('.fade-in');
const counters = document.querySelectorAll('.num');
let slides = document.querySelectorAll(".slide");
let currentSlide = 0;
let isPaused = false;

// function toggleSidebar() {
//     sidebar.classList.toggle('show-sidebar');
//     menuToggle.classList.toggle('open');
// }

function toggleSidebar() {
    const nav = document.querySelector(".nav");
    const overlay = document.querySelector(".overlay");

    sidebar.classList.toggle('show-sidebar');
    menuToggle.classList.toggle('open');
    nav.classList.toggle('open');
    overlay.classList.toggle('show');
}


function showNextSlide() {
    if (isPaused) return; // Stop the slide if paused
    currentSlide = (currentSlide + 1) % slides.length;
    const slider = document.querySelector(".slider");
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Store the interval in a variable so we can control it
let slideInterval = setInterval(showNextSlide, 4000);

// Pause/Play Logic
const sliderBtn = document.getElementById('sliderControl');

sliderBtn.addEventListener('click', () => {
    isPaused = !isPaused; // Toggle the state
    
    if (isPaused) {
        sliderBtn.innerText = "Play";
        sliderBtn.setAttribute('aria-label', 'Play slideshow');
    } else {
        sliderBtn.innerText = "Pause";
        sliderBtn.setAttribute('aria-label', 'Pause slideshow');
    }
});


window.addEventListener("scroll", function () {
    const nav = document.querySelector("nav");

    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});


const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -80px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer){
    entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});


window.addEventListener('load', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('show');
        }
    });
});



// Format numbers (adds K+ and +)
function formatNumber(num) {
    if (num >= 1000) {
        return Math.floor(num / 1000) + "K+";
    }
    return num + "+";
}

// Animate counting
function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || "+";
    let count = 0;

    const increment = target / 60;

    function updateCount() {
        count += increment;

        if (count < target) {
            counter.innerText = Math.floor(count) + suffix;
            requestAnimationFrame(updateCount);
        } else {
            counter.innerText = target + suffix;
        }
    }

    updateCount();
}

// Trigger when visible
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.5
});

counters.forEach(counter => {
    observer.observe(counter);
});