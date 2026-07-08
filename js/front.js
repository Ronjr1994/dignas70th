const root = document.documentElement;
const body = document.body;
const particleLayer = document.getElementById('particleLayer');
const openButton = document.getElementById('openInvitation');

function createParticles(){
  if(!particleLayer) return;
  const colors = [
    'rgba(249,215,137,.82)',
    'rgba(255,126,149,.72)',
    'rgba(255,244,246,.76)',
    'rgba(237,51,91,.62)'
  ];

  const total = window.innerWidth < 680 ? 42 : 74;
  particleLayer.innerHTML = '';

  for(let i = 0; i < total; i++){
    const particle = document.createElement('span');
    const isStar = Math.random() > .58;
    particle.className = `particle${isStar ? ' star' : ''}`;
    particle.style.setProperty('--x', `${Math.random() * 100}%`);
    particle.style.setProperty('--y', `${Math.random() * 115}%`);
    particle.style.setProperty('--s', `${isStar ? Math.random() * 2 + 1 : Math.random() * 8 + 4}px`);
    particle.style.setProperty('--o', `${Math.random() * .62 + .18}`);
    particle.style.setProperty('--d', `${Math.random() * 5 + 5}s`);
    particle.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
    particle.style.animationDelay = `${Math.random() * -8}s`;
    particleLayer.appendChild(particle);
  }
}

createParticles();

window.addEventListener('resize', () => {
  window.clearTimeout(window.__particleTimer);
  window.__particleTimer = window.setTimeout(createParticles, 180);
});

function updateFrontParallax(){
  root.style.setProperty('--parallax', `${Math.min(80, window.scrollY * .08)}px`);
}

updateFrontParallax();
window.addEventListener('scroll', updateFrontParallax, { passive:true });

openButton?.addEventListener('click', (event) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReducedMotion) return;

  event.preventDefault();
  const href = openButton.getAttribute('href');

  body.classList.add('is-opening');

  window.setTimeout(() => {
    window.location.href = href;
  }, 920);
});

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if(canHover){
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - .5) * -5;
      const ry = ((x / rect.width) - .5) * 5;
      card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('mousemove', event => {
      if(body.classList.contains('is-opening')) return;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * .08}px, ${y * .12}px) translateY(-2px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}
