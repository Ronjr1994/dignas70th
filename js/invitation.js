const root = document.documentElement;
const body = document.body;
const particleLayer = document.getElementById('particleLayer');
const officialLoader = document.getElementById('officialLoader');

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

function updateScroll(){
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = window.scrollY / maxScroll;
  root.style.setProperty('--scroll', progress.toFixed(4));
  root.style.setProperty('--parallax', `${Math.min(80, window.scrollY * .08)}px`);
}

updateScroll();
window.addEventListener('scroll', updateScroll, { passive:true });

window.addEventListener('load', () => {
  window.setTimeout(() => {
    officialLoader?.classList.add('is-hidden');
  }, 780);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold:.18,
  rootMargin:'0px 0px -10% 0px'
});

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
  revealObserver.observe(element);
});

const targetDate = new Date('2026-08-08T15:00:00');

function setText(id, value){
  const node = document.getElementById(id);
  if(node) node.textContent = String(value).padStart(2, '0');
}

function updateCountdown(){
  const now = new Date();
  const distance = targetDate - now;

  if(distance <= 0){
    ['days','hours','minutes','seconds'].forEach(id => setText(id, 0));
    return;
  }

  setText('days', Math.floor(distance / (1000 * 60 * 60 * 24)));
  setText('hours', Math.floor((distance / (1000 * 60 * 60)) % 24));
  setText('minutes', Math.floor((distance / (1000 * 60)) % 60));
  setText('seconds', Math.floor((distance / 1000) % 60));
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

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

// Edit program here later when final titles are available.
// Example:
// const finalProgram = [
//   { number:'01', title:'Opening Prayer', description:'Led by the family.' },
//   { number:'02', title:'Welcome Remarks', description:'A warm greeting for all guests.' }
// ];
const finalProgram = [];

if(finalProgram.length){
  const list = document.getElementById('programList');
  list.innerHTML = finalProgram.map((item, index) => `
    <article>
      <span>${item.number || String(index + 1).padStart(2, '0')}</span>
      <div>
        <h4>${item.title}</h4>
        <p>${item.description || ''}</p>
      </div>
    </article>
  `).join('');
}
