
const sidebar = document.getElementById("sidebar");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const navSearch = document.getElementById("navSearch");
const navLinks = [...document.querySelectorAll('.sidebar a[href^="#"]')];
const groupToggles = [...document.querySelectorAll('.nav-group-toggle')];
const sections = [...document.querySelectorAll('.doc-section, .hero')];
const roleChips = [...document.querySelectorAll('.role-chip')];

mobileMenuButton?.addEventListener("click", () => sidebar.classList.toggle("open"));
navLinks.forEach(link => link.addEventListener("click", () => {
  if (window.innerWidth <= 860) sidebar.classList.remove("open");
}));

groupToggles.forEach(btn => btn.addEventListener('click', () => {
  const list = btn.nextElementSibling;
  list.hidden = !list.hidden;
  btn.classList.toggle('collapsed', list.hidden);
}));

// Convert each screenshot into a collapsible gallery card
[...document.querySelectorAll('.doc-section .section-media')].forEach((media, index) => {
  const details = document.createElement('details');
  details.className = 'media-disclosure';
  if (index < 2) details.open = true;
  const summary = document.createElement('summary');
  summary.innerHTML = '<span>Screen preview</span>';
  media.parentNode.insertBefore(details, media);
  details.appendChild(summary);
  details.appendChild(media);
});

function applyRoleFilter(role) {
  document.querySelectorAll('.doc-section').forEach(section => {
    const roles = (section.dataset.roles || '').split(/\s+/).filter(Boolean);
    const show = role === 'all' || roles.includes(role);
    section.classList.toggle('is-hidden', !show);
  });

  document.querySelectorAll('.nav-group').forEach(group => {
    const links = [...group.querySelectorAll('a[href^="#"]')];
    let visible = 0;
    links.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      const hiddenByRole = target?.classList.contains('is-hidden');
      const matchesSearch = (link.closest('li') || link).style.display !== 'none';
      const shouldShow = !hiddenByRole && matchesSearch;
      (link.closest('li') || link).style.visibility = shouldShow ? '' : 'hidden';
      (link.closest('li') || link).style.height = shouldShow ? '' : '0';
      (link.closest('li') || link).style.overflow = shouldShow ? '' : 'hidden';
      if (shouldShow) visible++;
    });
    group.style.display = visible ? '' : 'none';
  });
}

roleChips.forEach(chip => chip.addEventListener('click', () => {
  roleChips.forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  applyRoleFilter(chip.dataset.role);
}));

function applySearch(q) {
  document.querySelectorAll('.nav-group').forEach(group => {
    const links = [...group.querySelectorAll('a[href^="#"]')];
    let visibleCount = 0;
    links.forEach(link => {
      const text = (link.dataset.title || link.textContent).toLowerCase();
      const match = q === '' || text.includes(q);
      const item = link.closest('li') || link;
      item.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });
    group.dataset.searchVisible = visibleCount;
  });

  const activeRole = document.querySelector('.role-chip.active')?.dataset.role || 'all';
  applyRoleFilter(activeRole);
}

navSearch?.addEventListener('input', e => applySearch(e.target.value.trim().toLowerCase()));

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
function bindLightboxImages() {
  const images = document.querySelectorAll(`
    .doc-section img,
    .hero img
  `);

  images.forEach((img) => {
    if (img.dataset.bound === 'true') return;

    img.dataset.bound = 'true';
    img.style.cursor = 'zoom-in';

    img.addEventListener('click', () => {
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || 'Screenshot';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });
}

bindLightboxImages();
function closeLightbox() {
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

applySearch('');
