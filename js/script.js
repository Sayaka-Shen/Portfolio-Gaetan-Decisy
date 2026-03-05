// Other classes
class BackgroundParticle 
{
  constructor() 
  { 
    this.Reset(); 
  }

  Reset() 
  {
    this.x = Math.random() * screenWidth;
    this.y = Math.random() * screenHeight;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.3;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.5 ? '0,245,255' : '255,0,170';
  }

  Update() 
  {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight) 
    {
      this.Reset();
    }
  }

  Draw() 
  {
    backgroundContext.beginPath();
    backgroundContext.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    backgroundContext.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    backgroundContext.fill();
  }
}

// ── CUSTOM CURSOR ──
const customCursor = document.getElementById('customCursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0;
let mouseY = 0; 
let trailX = 0; 
let trailY = 0;

document.addEventListener('mousemove', e => 
{
  mouseX = e.clientX;
  mouseY = e.clientY;
  customCursor.style.left = mouseX + 'px';
  customCursor.style.top = mouseY + 'px';
});

function AnimCursorTrail() 
{
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(AnimCursorTrail);
};

requestAnimationFrame(AnimCursorTrail);

document.querySelectorAll('a, button, .badge, .project-card, .filter-btn, .contact-link').forEach(el => 
{
  el.addEventListener('mouseenter', () =>
  {
    cursorTrail.style.width = '60px';
    cursorTrail.style.height = '60px';
    cursorTrail.style.opacity = '0.8';
    customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });

  el.addEventListener('mouseleave', () => 
  {
    cursorTrail.style.width = '36px';
    cursorTrail.style.height = '36px';
    cursorTrail.style.opacity = '0.5';
    customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ── HAMBURGER MENU ──
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileNavigation = document.getElementById('mobileNavigation');

mobileMenuButton.addEventListener('click', () => 
{
  mobileMenuButton.classList.toggle('open');
  mobileNavigation.classList.toggle('open');
});

mobileNavigation.querySelectorAll('a').forEach(a => 
{
  a.addEventListener('click', () => 
  {
    mobileMenuButton.classList.remove('open');
    mobileNavigation.classList.remove('open');
  });
});

// ── PARTICLES CANVAS ──
const backgroundCanvas = document.getElementById('backgroundCanvas');
const backgroundContext = backgroundCanvas.getContext('2d');
let screenWidth, screenHeight;
let particleSystem = [];

function resize() 
{
  screenWidth = backgroundCanvas.width = window.innerWidth;
  screenHeight = backgroundCanvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 120; i++) 
{ 
  particleSystem.push(new BackgroundParticle())
};

function AnimateBackgroundParticle() 
{
  backgroundContext.clearRect(0, 0, screenWidth, screenHeight);
  particleSystem.forEach(p => { p.Update(); p.Draw(); });

  for (let i = 0; i < particleSystem.length; i++) 
  {
    for (let j = i + 1; j < particleSystem.length; j++) 
    {
      const dx = particleSystem[i].x - particleSystem[j].x;
      const dy = particleSystem[i].y - particleSystem[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < 100) 
      {
        backgroundContext.beginPath();
        backgroundContext.moveTo(particleSystem[i].x, particleSystem[i].y);
        backgroundContext.lineTo(particleSystem[j].x, particleSystem[j].y);
        backgroundContext.strokeStyle = `rgba(0, 245, 255, ${0.08 * (1 - d / 100)})`;
        backgroundContext.lineWidth = 0.5;
        backgroundContext.stroke();
      }
    }
  }

  requestAnimationFrame(AnimateBackgroundParticle);
} 

requestAnimationFrame(AnimateBackgroundParticle);

// ── SCROLL REVEAL ──
const scrollRevealObserver = new IntersectionObserver(entries => 
{
  entries.forEach((e, i) => 
  {
    if (e.isIntersecting)
    {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    } 
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => scrollRevealObserver.observe(el));

// ── FILTER BUTTONS ──
const filterButtons = document.querySelectorAll(".filter-btn");
const projectsCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => 
{
  button.addEventListener('click', () => 
  {
    // Remove all class active for every btn and add to the one who should be active
    filterButtons.forEach(button => button.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    projectsCards.forEach(card =>
    {
      const category = card.dataset.category;
      
      if (filter === "all" || category === filter)
      {
        card.style.display = "block";
      }
      else
      {
        card.style.display = "none";
      }
    });
  });
});


// --- CLICKABLE CARD ---
const projectCards = document.querySelectorAll(".project-card")

projectCards.forEach((card, index) => 
{
  card.addEventListener("click", () => 
  {
    const link = card.querySelector(".project-link"); 
    
    if (link)
    {
      window.location.href = link.href;
    }
  });

});
