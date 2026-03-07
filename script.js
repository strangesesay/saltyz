const menuBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a[data-nav]');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const page = location.pathname.split('/').pop() || 'index.html';
navAnchors.forEach((anchor) => {
  anchor.classList.toggle('active', anchor.dataset.nav === page);
});

document.querySelectorAll('.current-year').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('show'));
}

const bookingForm = document.querySelector('[data-booking-form]');
const bookingStatus = document.querySelector('[data-booking-status]');
const submitButton = document.querySelector('[data-submit-button]');

function setStatus(message, isError) {
  if (!bookingStatus) return;
  bookingStatus.textContent = message;
  bookingStatus.style.color = isError ? '#ff9e9e' : '#e0c58f';
}

async function submitToFormspree(form) {
  const endpoint = form.dataset.formspree;
  if (!endpoint || endpoint.includes('yourFormId')) {
    throw new Error('Set a valid Formspree endpoint in booking.html.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new FormData(form)
  });

  if (!response.ok) {
    throw new Error('Formspree rejected the booking request.');
  }
}

if (bookingForm) {
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }

    setStatus('Submitting your booking request...', false);

    try {
      await submitToFormspree(bookingForm);
      bookingForm.reset();
      setStatus('Booking request sent successfully. We will contact you shortly.', false);
    } catch (error) {
      setStatus(error.message || 'Booking submission failed. Please try again.', true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Confirm Booking';
      }
    }
  });
}
