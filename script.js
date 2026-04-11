
const sidebar = document.getElementById('sidebar');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const navSearch = document.getElementById('navSearch');
const navLinks = [...document.querySelectorAll('.sidebar a[href^="#"]')];
const groupToggles = [...document.querySelectorAll('.nav-group-toggle')];

mobileMenuButton?.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 860) sidebar.classList.remove('open');
  });
});

groupToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const list = btn.nextElementSibling;
    list.hidden = !list.hidden;
  });
});

navSearch?.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  navLinks.forEach(link => {
    const text = (link.dataset.title || link.textContent).toLowerCase();
    const match = text.includes(q);
    const item = link.closest('li') || link;
    item.style.display = match || q === '' ? '' : 'none';
  });
});

const sections = [...document.querySelectorAll('.doc-section, .hero')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0.1 });

sections.forEach(section => observer.observe(section));

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
document.querySelectorAll('.section-media img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    sidebar.classList.remove('open');
  }
});
