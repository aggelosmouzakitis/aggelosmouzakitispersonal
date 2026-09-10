const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();

const hostForm = document.querySelector("[data-host-form]");
const formStatus = document.querySelector("[data-form-status]");

if (hostForm && formStatus) {
  hostForm.addEventListener("submit", () => {
    formStatus.hidden = false;
    const submitButton = hostForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
    }
  });
}
