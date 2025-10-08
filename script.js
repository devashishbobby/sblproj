document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  // 🌊 Smooth Scroll
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // 🌈 Active Nav Highlight
  const highlightNav = () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.id;
      }
    });
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
    // Add a small message container below form if missing
    let msg = document.querySelector("#form-msg");
    if (!msg) {
      msg = document.createElement("p");
      msg.id = "form-msg";
      msg.style.textAlign = "center";
      msg.style.marginTop = "0.5rem";
      form.after(msg);
    }

    form.addEventListener("submit", e => {
      e.preventDefault();
      const { name, email, message } = form.elements;
      const nameVal = name.value.trim();
      const emailVal = email.value.trim();
      const messageVal = message.value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        msg.textContent = "⚠️ Please fill out all fields before submitting.";
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
});
