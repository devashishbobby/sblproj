// --- ⚙️ Firebase Setup ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbopHBMCkJ_5mKyZfQp3mGK7zHfOyswQY",
  authDomain: "focusflow-tracker-7307d.firebaseapp.com",
  projectId: "focusflow-tracker-7307d",
  storageBucket: "focusflow-tracker-7307d.appspot.com",
  messagingSenderId: "553409175215",
  appId: "1:553409175215:web:de3cd1a3c46e36e7bdfe5a"
};


// --- ✨ Main Logic ---
document.addEventListener("DOMContentLoaded", () => {
    // --- Original Page Logic ---
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    // 🌊 Smooth Scroll for Nav links
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href.startsWith("#")) {
            link.addEventListener("click", e => {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        }
    });

    // 🌈 Active Nav Highlight on scroll
    const highlightNav = () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.id;
            }
        });

        // BUG FIX: Handle the edge case for the last section when scrolled to the bottom.
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) { // 2px buffer for precision
            current = sections[sections.length - 1].id;
        }

        links.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    };
    window.addEventListener("scroll", highlightNav);
    highlightNav();

    // ✨ Scroll-triggered Animations
    const revealElements = document.querySelectorAll(".tracker-preview, .card, .contact");
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) el.classList.add("visible");
        });
    };
    revealElements.forEach(el => el.classList.add("fade-in"));
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    // ✅ CONTACT FORM VALIDATION
    const form = document.querySelector("#contact-form");
    if (form) {
        const msg = document.querySelector("#form-msg");
        form.addEventListener("submit", e => {
            e.preventDefault();
            const { name, email, message } = form.elements;
            const nameVal = name.value.trim();
            const emailVal = email.value.trim();
            const messageVal = message.value.trim();

            if (!nameVal || !emailVal || !messageVal) {
                msg.textContent = "⚠️ Please fill out all fields.";
                msg.style.color = "#FF6B00";
                return;
            }
            const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailVal);
            if (!emailValid) {
                msg.textContent = "⚠️ Please enter a valid email address.";
                msg.style.color = "#FF6B00";
                return;
            }
            msg.textContent = `✅ Thank you, ${nameVal}! Your message has been sent.`;
            msg.style.color = "#2FC57C";
            form.reset();
            setTimeout(() => (msg.textContent = ""), 3000);
        });
    }

    // --- New Authentication & Guest Mode Logic ---

    // Check if Firebase config is valid before initializing
    if (!firebaseConfig || !firebaseConfig.apiKey) {
        console.error("Firebase config is missing or invalid.");
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.textContent = "Google Sign-In Disabled";
            loginBtn.disabled = true;
        }
        // Also hide signup if there is one
        const signupBtn = document.getElementById('signup-btn');
        if(signupBtn) signupBtn.style.display = 'none';

    } else {
        // Initialize Firebase if config is present
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');

        const handleAuth = () => {
             signInWithPopup(auth, provider)
                .then(() => {
                    // Redirect to tracker page for logged-in user
                    window.location.href = 'tracker.html';
                }).catch((error) => {
                    console.error("Google Sign-In Error:", error.code, error.message);
                });
        };

        if (loginBtn) loginBtn.addEventListener('click', handleAuth);
        if (signupBtn) signupBtn.addEventListener('click', handleAuth);
    }

    // Guest Mode Logic
    const guestButton = document.getElementById('guest-btn');
    const guestModal = document.getElementById('guest-modal-backdrop');

    if (guestButton && guestModal) {
        guestButton.addEventListener('click', () => {
            guestModal.classList.add('open');
            // Redirect after showing the message for 2.5 seconds
            setTimeout(() => {
                window.location.href = 'tracker.html?guest=true';
            }, 2500);
        });
    }
});

