/* ============================================================
   PORTFOLIO — main.js
   Particles · Cursor · Typed · Scroll · Counter · Form
============================================================ */

/* ---------- Custom Cursor (desktop only) ---------- */
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

if (!isTouch && dot && outline) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    (function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.14;
        outlineY += (mouseY - outlineY) * 0.14;
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';
        requestAnimationFrame(animateOutline);
    })();

    document.querySelectorAll('a, button, .soft-card, .project-card, .social-icon, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

/* ---------- Particles ---------- */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '99,102,241' : '56,189,248';
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(Math.floor(W * H / 12000), 120);
    particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawConnections() {
    const dist = 120;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < dist) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(99,102,241,${(1 - d / dist) * 0.1})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

let particleAnimId;

function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    particleAnimId = requestAnimationFrame(animateParticles);
}
animateParticles();

/* Pause particles when tab is hidden to save CPU/battery */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(particleAnimId);
    } else {
        animateParticles();
    }
});

/* ---------- Navbar Scroll + Scroll Indicator ---------- */
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');
const scrollIndicator = document.getElementById('scrollIndicator');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    navbar.classList.toggle('scrolled', scrollY > 60);
    backTop.classList.toggle('visible', scrollY > 60);

    /* Hide scroll indicator once user starts scrolling */
    if (scrollIndicator) scrollIndicator.classList.toggle('hidden', scrollY > 40);

    /* Active nav link highlight */
    let current = '';
    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Mobile Menu ---------- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksEl.classList.remove('open');
    });
});

/* ---------- Theme Toggle ---------- */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);
themeIcon.className = saved === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeIcon.className = next === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});

/* ---------- Typed Text ---------- */
const words = [
    'Admin Produksi',
    'WMS Specialist',
    'Document Manager',
    'Production Planner',
    'Audit Operator',
];
let wordIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
    const word = words[wordIdx];
    if (!deleting) {
        typedEl.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) {
            deleting = true;
            setTimeout(type, 1800);
            return;
        }
    } else {
        typedEl.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) {
            deleting = false;
            wordIdx = (wordIdx + 1) % words.length;
        }
    }
    setTimeout(type, deleting ? 55 : 90);
}
type();

/* ---------- Reveal on Scroll ---------- */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- Skill Bars ---------- */
const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-bars').forEach(el => barObserver.observe(el));

/* ---------- Counter Animation ---------- */
function animateCounter(el, target) {
    let start = 0;
    const duration = 1800;
    const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    };
    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(el => {
                animateCounter(el, parseInt(el.dataset.target));
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(el => counterObserver.observe(el));

/* ---------- Contact Form ---------- */
const form = document.getElementById('contactForm');

function showFieldError(input, msg) {
    input.classList.add('error');
    let err = input.parentElement.querySelector('.form-error-msg');
    if (!err) {
        err = document.createElement('span');
        err.className = 'form-error-msg';
        input.parentElement.appendChild(err);
    }
    err.textContent = msg;
}

function clearFieldError(input) {
    input.classList.remove('error');
    const err = input.parentElement.querySelector('.form-error-msg');
    if (err) err.remove();
}

form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => clearFieldError(field));
});

form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = form.querySelector('#name');
    const email   = form.querySelector('#email');
    const message = form.querySelector('#message');

    if (!name.value.trim()) { showFieldError(name, 'Nama tidak boleh kosong.'); valid = false; }
    if (!email.value.trim()) {
        showFieldError(email, 'Email tidak boleh kosong.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showFieldError(email, 'Format email tidak valid.'); valid = false;
    }
    if (!message.value.trim()) { showFieldError(message, 'Pesan tidak boleh kosong.'); valid = false; }

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Membuka email...';
    btn.disabled = true;

    const subject = form.querySelector('#subject').value.trim() || 'Pesan dari Portfolio';
    const body = `Halo Dimas,\n\nNama: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\n${message.value.trim()}`;
    const mailtoLink = `mailto:dimaslystianto11@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Email dibuka!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        form.reset();

        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }, 800);
});

/* ---------- Footer Year ---------- */
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ---------- Smooth Scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
});
