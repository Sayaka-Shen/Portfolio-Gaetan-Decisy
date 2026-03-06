/* =========================
    CUSTOM CURSOR
========================= */
const customCursor = document.getElementById('customCursor');
const cursorTrail  = document.getElementById('cursorTrail');

let mouseX = 0;
let mouseY = 0;
let ringX  = 0;
let ringY  = 0;

document.addEventListener('mousemove', (e) => 
{
    mouseX = e.clientX;
    mouseY = e.clientY;
    customCursor.style.left = mouseX + 'px';
    customCursor.style.top  = mouseY + 'px';
});

function animateRing() 
{
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorTrail.style.left = ringX + 'px';
    cursorTrail.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .contributions > div').forEach((el) => 
{
    el.addEventListener('mouseenter', () => 
    {
        cursorTrail.style.width  = '60px';
        cursorTrail.style.height = '60px';
        cursorTrail.style.opacity = '0.8';
        customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });

    el.addEventListener('mouseleave', () => 
    {
        cursorTrail.style.width  = '36px';
        cursorTrail.style.height = '36px';
        cursorTrail.style.opacity = '0.5';
        customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

/* =========================
    PARTICLE BACKGROUND
========================= */
const backgroundCanvas  = document.getElementById('bg-canvas');
const backgroundContext = backgroundCanvas.getContext('2d');

let width, height;

function resizeCanvas() 
{
    width  = backgroundCanvas.width  = window.innerWidth;
    height = backgroundCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle 
{
    constructor() { this.reset(); }

    reset() 
    {
        this.x      = Math.random() * width;
        this.y      = Math.random() * height;
        this.vx     = (Math.random() - 0.5) * 0.3;
        this.vy     = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.3;
        this.alpha  = Math.random() * 0.6 + 0.1;
        this.color  = Math.random() > 0.5 ? '0,245,255' : '255,0,170';
    }

    update() 
    {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) 
        {
            this.reset();
        }
    }

    draw() 
    {
        backgroundContext.beginPath();
        backgroundContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        backgroundContext.fillStyle = `rgba(${this.color},${this.alpha})`;
        backgroundContext.fill();
    }
}

const PARTICLE_COUNT = 80;
const particleSystem = [];
for (let i = 0; i < PARTICLE_COUNT; i++) 
{
    particleSystem.push(new Particle());
}

function animateParticles() 
{
    backgroundContext.clearRect(0, 0, width, height);

    particleSystem.forEach((p) => 
    { 
        p.update(); 
        p.draw(); 
    });

    for (let i = 0; i < particleSystem.length; i++) 
    {
        for (let j = i + 1; j < particleSystem.length; j++) 
        {
            const dx = particleSystem[i].x - particleSystem[j].x;
            const dy = particleSystem[i].y - particleSystem[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) 
            {
                backgroundContext.beginPath();
                backgroundContext.moveTo(particleSystem[i].x, particleSystem[i].y);
                backgroundContext.lineTo(particleSystem[j].x, particleSystem[j].y);
                backgroundContext.strokeStyle = `rgba(0,245,255,${0.08 * (1 - distance / 100)})`;
                backgroundContext.lineWidth = 0.5;
                backgroundContext.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

animateParticles();

/* =========================
    LIGHTBOX (preview-grid)
========================= */
function initLightbox() 
{
    // Crée l'overlay une seule fois
    const overlay = document.createElement('div');
    overlay.id = 'lightbox';
    overlay.innerHTML = `
        <button id="lightbox-close" title="Fermer">✕</button>
        <img id="lightbox-img" src="" alt="">
    `;
    document.body.appendChild(overlay);

    const lightboxImg = overlay.querySelector('#lightbox-img');

    function open(src, alt) 
    {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() 
    {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    // Attache aux img dans .preview-grid (ignore les vidéos automatiquement)
    const images = document.querySelectorAll('.preview-grid img');
    images.forEach(img => 
    {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => open(img.src, img.alt));
    });

    // Fermeture
    overlay.addEventListener('click', close);
    overlay.querySelector('#lightbox-close').addEventListener('click', close);
    lightboxImg.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
};

initLightbox();

// -- Scroll Observer --
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