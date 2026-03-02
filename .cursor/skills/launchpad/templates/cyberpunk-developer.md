# Cyberpunk Developer Portfolio Template

A developer portfolio with RPG/gaming aesthetic. Achievement cards, skill tier lists, glitch effects, and terminal-inspired UI.

---

## When to Use

- Developer portfolios with personality
- Gaming-themed personal sites
- Tech-forward personal brands
- Creative developer showcases
- Anyone who wants their portfolio to feel like an RPG character sheet

---

## Example Data Notice

> **This template includes realistic example data** to make the first iteration viewable. Look for `// -- EXAMPLE DATA --` comments marking data you should replace with your own content.

## Structure

```
1. Hero — Name, title with typewriter effect, mouse-tracking SVG
2. Projects — Achievement cards with rarity badges
3. Skills — Tier list (S/A/B/C rankings)
4. About — System specs styling
5. Contact — Glitch text effect CTA
6. Footer — Minimal terminal-style
```

---

## Direction Prompts

Before using this template, answer:

1. **What's your class?** Frontend Wizard? Backend Architect? Full-Stack Paladin?
2. **What achievements matter?** Ship counts? GitHub stats? Notable projects?
3. **What's your rarity?** What makes you legendary vs common?
4. **How much glitch?** Subtle accents or full cyberpunk chaos?

---

## Design Tokens

```css
@theme {
  /* Colors */
  --color-void: #0D0D0D;
  --color-charcoal: #1A1A1A;
  --color-tangerine: #FF6B35;
  --color-glitch: #FFE66D;
  --color-mint: #4ECDC4;
  --color-off-white: #FAFAFA;
  --color-cool-gray: #A0A0A0;

  /* Semantic mappings */
  --color-surface: var(--color-void);
  --color-surface-alt: var(--color-charcoal);
  --color-brand: var(--color-tangerine);
  --color-accent: var(--color-glitch);
  --color-terminal: var(--color-mint);
  --color-ink: var(--color-off-white);
  --color-ink-muted: var(--color-cool-gray);

  /* Typography */
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

**Font imports:**
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Section Blueprints

### 1. Hero

```tsx
<section className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-24 bg-void overflow-hidden">
  {/* Mouse-tracking SVG background */}
  <div className="absolute inset-0 pointer-events-none">
    <AbstractSVG />
  </div>

  <div className="relative max-w-4xl">
    {/* Terminal-style eyebrow */}
    <div className="flex items-center gap-2 text-mint font-mono text-sm mb-6">
      <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
      <span>~/portfolio</span>
      <span className="animate-blink">_</span>
    </div>

    <h1 className="text-[clamp(3rem,10vw,7rem)] font-display font-bold tracking-tight leading-[0.9] text-off-white">
      {/* -- EXAMPLE DATA -- */}
      Kai Chen
      {/* -- END EXAMPLE DATA -- */}
    </h1>

    <div className="mt-4 text-2xl md:text-3xl text-cool-gray font-mono">
      <TypewriterText
        strings={[
          // -- EXAMPLE DATA --
          'Full-Stack Developer',
          'Open Source Contributor',
          'Problem Solver',
          // -- END EXAMPLE DATA --
        ]}
      />
    </div>

    <p className="mt-8 text-lg text-cool-gray max-w-xl leading-relaxed">
      {/* -- EXAMPLE DATA -- */}
      Level 28 developer specializing in React ecosystems and distributed systems.
      Currently on a quest to make the web faster and more accessible.
      {/* -- END EXAMPLE DATA -- */}
    </p>

    {/* Stats row */}
    <div className="mt-10 flex flex-wrap gap-8">
      <Stat label="Projects Shipped" value={42} />
      <Stat label="GitHub Stars" value={1200} suffix="+" />
      <Stat label="Years XP" value={6} />
    </div>

    <div className="mt-10 flex gap-4">
      <a href="#projects" className="btn-primary">
        View Achievements
      </a>
      <a href="#contact" className="btn-secondary">
        Start Quest
      </a>
    </div>
  </div>
</section>
```

**Stat Component:**
```tsx
function Stat({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-display font-bold text-tangerine">
        <AnimatedCounter target={value} />{suffix}
      </div>
      <div className="text-sm text-cool-gray font-mono uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}
```

### 2. Projects — Achievement Cards

**Projects Data:**
```tsx
// -- EXAMPLE DATA --
const projects = [
  {
    id: 1,
    title: 'NeonDB',
    description: 'Real-time database with built-in conflict resolution',
    rarity: 'legendary',
    tags: ['TypeScript', 'Rust', 'WebSocket'],
    stats: { stars: 2400, forks: 180 },
    url: 'https://github.com/example/neondb',
  },
  {
    id: 2,
    title: 'ReactForge',
    description: 'CLI tool for scaffolding production-ready React apps',
    rarity: 'epic',
    tags: ['Node.js', 'React', 'CLI'],
    stats: { stars: 890, forks: 45 },
    url: 'https://github.com/example/reactforge',
  },
  {
    id: 3,
    title: 'Pixelate',
    description: 'WebGL image processing library with 60fps filters',
    rarity: 'rare',
    tags: ['WebGL', 'Canvas', 'WASM'],
    stats: { stars: 340, forks: 28 },
    url: 'https://github.com/example/pixelate',
  },
  {
    id: 4,
    title: 'DevDash',
    description: 'Personal dashboard for tracking coding metrics',
    rarity: 'uncommon',
    tags: ['Next.js', 'Prisma', 'Charts'],
    stats: { stars: 120, forks: 15 },
    url: 'https://github.com/example/devdash',
  },
];
// -- END EXAMPLE DATA --
```

**Section Layout:**
```tsx
<section id="projects" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-charcoal">
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center gap-4 mb-12">
      <h2 className="text-3xl md:text-4xl font-display font-bold text-off-white">
        Achievements Unlocked
      </h2>
      <span className="px-3 py-1 text-sm font-mono bg-tangerine/20 text-tangerine rounded">
        {projects.length} / ∞
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <AchievementCard key={project.id} project={project} />
      ))}
    </div>
  </div>
</section>
```

**Achievement Card Component:**
```tsx
function AchievementCard({ project }) {
  const rarityColors = {
    legendary: 'border-amber-400 bg-amber-400/5',
    epic: 'border-purple-500 bg-purple-500/5',
    rare: 'border-blue-500 bg-blue-500/5',
    uncommon: 'border-green-500 bg-green-500/5',
  };

  const rarityBadge = {
    legendary: 'bg-amber-400 text-black',
    epic: 'bg-purple-500 text-white',
    rare: 'bg-blue-500 text-white',
    uncommon: 'bg-green-500 text-white',
  };

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block p-6 rounded-xl border-2 ${rarityColors[project.rarity]}
        hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
    >
      {/* Hover sweep effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
        -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      {/* Rarity badge */}
      <span className={`absolute top-4 right-4 px-2 py-0.5 text-xs font-mono uppercase rounded ${rarityBadge[project.rarity]}`}>
        {project.rarity}
      </span>

      {/* Content */}
      <h3 className="text-xl font-display font-bold text-off-white mb-2 group-hover:text-tangerine transition-colors">
        {project.title}
      </h3>

      <p className="text-cool-gray text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 text-xs font-mono bg-void text-mint rounded">
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-cool-gray">
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          {project.stats.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-4 h-4" />
          {project.stats.forks}
        </span>
      </div>
    </a>
  );
}
```

### 3. Skills — Tier List

**Skills Data:**
```tsx
// -- EXAMPLE DATA --
const skillTiers = [
  {
    tier: 'S',
    color: 'text-amber-400 border-amber-400',
    bgColor: 'bg-amber-400/10',
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    tier: 'A',
    color: 'text-purple-400 border-purple-400',
    bgColor: 'bg-purple-400/10',
    skills: ['Next.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
  },
  {
    tier: 'B',
    color: 'text-blue-400 border-blue-400',
    bgColor: 'bg-blue-400/10',
    skills: ['Rust', 'GraphQL', 'Redis', 'AWS'],
  },
  {
    tier: 'C',
    color: 'text-green-400 border-green-400',
    bgColor: 'bg-green-400/10',
    skills: ['Python', 'Go', 'Kubernetes', 'WebGL'],
  },
];
// -- END EXAMPLE DATA --
```

**Section Layout:**
```tsx
<section id="skills" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-void">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-display font-bold text-off-white mb-4">
      Skill Tree
    </h2>
    <p className="text-cool-gray mb-12">
      Technologies ranked by proficiency and battle-tested experience.
    </p>

    <div className="space-y-4">
      {skillTiers.map((tier) => (
        <TierRow key={tier.tier} {...tier} />
      ))}
    </div>
  </div>
</section>
```

**TierRow Component:**
```tsx
function TierRow({ tier, color, bgColor, skills }) {
  return (
    <div className="flex items-stretch gap-4">
      {/* Tier label */}
      <div className={`w-16 flex items-center justify-center border-2 ${color} rounded-lg font-display font-bold text-2xl`}>
        {tier}
      </div>

      {/* Skills */}
      <div className={`flex-1 flex flex-wrap items-center gap-3 p-4 ${bgColor} rounded-lg`}>
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-4 py-2 bg-charcoal text-off-white font-mono text-sm rounded-lg
              hover:bg-tangerine hover:text-void transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
```

### 4. About — System Specs Style

```tsx
<section id="about" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-charcoal">
  <div className="max-w-4xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Avatar */}
      <div className="md:col-span-1">
        <div className="aspect-square rounded-xl overflow-hidden border-2 border-tangerine/50
          shadow-[0_0_30px_rgba(255,107,53,0.3)]">
          <img src="/avatar.jpg" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* System specs */}
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-3xl font-display font-bold text-off-white">
          System Specs
        </h2>

        <div className="font-mono text-sm space-y-3 bg-void p-6 rounded-xl border border-cool-gray/20">
          <div className="flex">
            <span className="text-mint w-32">name:</span>
            {/* -- EXAMPLE DATA -- */}
            <span className="text-off-white">Kai Chen</span>
            {/* -- END EXAMPLE DATA -- */}
          </div>
          <div className="flex">
            <span className="text-mint w-32">class:</span>
            {/* -- EXAMPLE DATA -- */}
            <span className="text-off-white">Full-Stack Developer</span>
            {/* -- END EXAMPLE DATA -- */}
          </div>
          <div className="flex">
            <span className="text-mint w-32">location:</span>
            {/* -- EXAMPLE DATA -- */}
            <span className="text-off-white">San Francisco, CA</span>
            {/* -- END EXAMPLE DATA -- */}
          </div>
          <div className="flex">
            <span className="text-mint w-32">status:</span>
            <span className="text-tangerine">Open to opportunities</span>
          </div>
          <div className="flex">
            <span className="text-mint w-32">interests:</span>
            {/* -- EXAMPLE DATA -- */}
            <span className="text-off-white">OSS, Performance, Developer Tools</span>
            {/* -- END EXAMPLE DATA -- */}
          </div>
        </div>

        <p className="text-cool-gray leading-relaxed">
          {/* -- EXAMPLE DATA -- */}
          Started coding at 14, shipped my first production app at 19. I believe great software
          is built by people who sweat the details. When I'm not pushing commits, you'll find me
          speedrunning indie games or contributing to open source projects that make developers'
          lives easier.
          {/* -- END EXAMPLE DATA -- */}
        </p>

        <div className="flex gap-4">
          <a href="#" className="text-cool-gray hover:text-tangerine transition-colors">
            <Github className="w-6 h-6" />
          </a>
          <a href="#" className="text-cool-gray hover:text-tangerine transition-colors">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" className="text-cool-gray hover:text-tangerine transition-colors">
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 5. Contact — Glitch Effect CTA

```tsx
<section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-void">
  <div className="max-w-2xl mx-auto text-center">
    <GlitchText
      text="Let's Build Something"
      className="text-4xl md:text-5xl font-display font-bold text-off-white mb-6"
    />

    <p className="text-xl text-cool-gray mb-10">
      {/* -- EXAMPLE DATA -- */}
      Ready to join your party. Whether it's a raid on legacy code or
      crafting something new from scratch.
      {/* -- END EXAMPLE DATA -- */}
    </p>

    <a
      {/* -- EXAMPLE DATA -- */}
      href="mailto:kai@example.dev"
      {/* -- END EXAMPLE DATA -- */}
      className="inline-flex items-center gap-3 px-8 py-4 bg-tangerine text-void font-display font-bold
        rounded-lg hover:bg-glitch transition-colors group"
    >
      <Mail className="w-5 h-5" />
      Send Message
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </a>

    <p className="mt-8 text-sm text-cool-gray font-mono">
      Response time: ~24 hours
    </p>
  </div>
</section>
```

---

## Signature Components

### TypewriterText

```tsx
import { useState, useEffect } from 'react';

function TypewriterText({ strings, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000 }) {
  const [displayText, setDisplayText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentString = strings[stringIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentString.slice(0, displayText.length + 1));
        if (displayText === currentString) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        setDisplayText(currentString.slice(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setStringIndex((prev) => (prev + 1) % strings.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, stringIndex, strings]);

  return (
    <span>
      {displayText}
      <span className="animate-blink text-tangerine">|</span>
    </span>
  );
}
```

### AbstractSVG (Mouse-Tracking Orbital Rings)

```tsx
import { useState, useEffect } from 'react';

function AbstractSVG() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const offsetX = (mousePos.x - 0.5) * 50;
  const offsetY = (mousePos.y - 0.5) * 50;

  return (
    <svg
      viewBox="0 0 800 800"
      className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] opacity-30"
    >
      {/* Orbital rings */}
      {[1, 2, 3].map((i) => (
        <ellipse
          key={i}
          cx={400 + offsetX * i * 0.3}
          cy={400 + offsetY * i * 0.3}
          rx={100 + i * 80}
          ry={40 + i * 30}
          fill="none"
          stroke="var(--color-tangerine)"
          strokeWidth={1}
          className="animate-float"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}

      {/* Center glow */}
      <circle
        cx={400 + offsetX}
        cy={400 + offsetY}
        r="20"
        fill="var(--color-tangerine)"
        className="animate-pulse-glow"
      />
    </svg>
  );
}
```

### GlitchText

```tsx
function GlitchText({ text, className = '' }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute top-0 left-0 -translate-x-[2px] translate-y-[2px] text-mint opacity-70 z-0"
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 translate-x-[2px] -translate-y-[1px] text-tangerine opacity-70 z-0"
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}
```

### AnimatedCounter

```tsx
import { useEffect, useState, useRef } from 'react';

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}
```

---

## Animations

Add to your global CSS:

```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    filter: drop-shadow(0 0 10px var(--color-tangerine));
  }
  50% {
    opacity: 0.7;
    filter: drop-shadow(0 0 20px var(--color-tangerine));
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-blink { animation: blink 1s step-end infinite; }
.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-shimmer { animation: shimmer 2s infinite; }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
.animate-fade-up { animation: fadeUp 0.6s ease-out; }
```

---

## Tailwind Theme Setup

```css
/* In your global CSS or Tailwind config */

@theme {
  --color-void: #0D0D0D;
  --color-charcoal: #1A1A1A;
  --color-tangerine: #FF6B35;
  --color-glitch: #FFE66D;
  --color-mint: #4ECDC4;
  --color-off-white: #FAFAFA;
  --color-cool-gray: #A0A0A0;

  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

/* Component classes */
.btn-primary {
  @apply px-6 py-3 bg-tangerine text-void font-display font-bold rounded-lg
    hover:bg-glitch transition-colors;
}

.btn-secondary {
  @apply px-6 py-3 border-2 border-tangerine text-tangerine font-display font-bold rounded-lg
    hover:bg-tangerine hover:text-void transition-colors;
}

.card-achievement {
  @apply relative p-6 rounded-xl border-2 bg-charcoal overflow-hidden
    hover:scale-[1.02] transition-all duration-300;
}

/* Rarity utilities */
.rarity-legendary {
  @apply border-amber-400 bg-amber-400/5;
}

.rarity-epic {
  @apply border-purple-500 bg-purple-500/5;
}

.rarity-rare {
  @apply border-blue-500 bg-blue-500/5;
}

.rarity-uncommon {
  @apply border-green-500 bg-green-500/5;
}

/* Tier utilities */
.tier-s { @apply text-amber-400 border-amber-400; }
.tier-a { @apply text-purple-400 border-purple-400; }
.tier-b { @apply text-blue-400 border-blue-400; }
.tier-c { @apply text-green-400 border-green-400; }

/* Terminal text */
.terminal-text {
  @apply font-mono text-mint;
}
```

---

## Anti-Patterns

- **Too much glitch** — Use effects sparingly; readability first
- **Generic RPG terms** — Make metaphors specific to YOUR story
- **Fake stats** — Only show metrics you're proud of
- **Missing personality** — The theme is a vehicle, not the destination
- **Slow animations** — Keep total animation time under 3s
- **No fallbacks** — Ensure it works without JS/animations

---

## Customization Checklist

Replace the example data with your own content:

- [ ] **Hero** — Your name, titles (typewriter strings), and bio
- [ ] **Stats** — Your actual numbers (projects, stars, years)
- [ ] **Projects** — Your 3-6 best projects with accurate stats and rarity
- [ ] **Skills** — Your actual tech stack, ranked honestly
- [ ] **About** — Your system specs (location, status, interests)
- [ ] **Contact** — Your email and social links
- [ ] **Avatar** — Your photo or custom avatar
- [ ] **Color tuning** — Adjust tangerine/mint if needed for your brand

---

## Next Steps

1. Answer the direction prompts
2. Decide on glitch intensity (subtle vs. full)
3. Build hero → projects → skills → about → contact
4. Test animations on slower devices
5. Run craft checks before launching
6. Offer to save patterns to `.launchpad/system.md`

This template should feel like YOUR character sheet, not a generic gaming theme.
