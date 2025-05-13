import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger';

// Theme + Animation Configuration
const config = {
  theme: 'dark', // Default theme
  animate: true,
};

// DOM Updates for Theme and Animation State
const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.animate = config.animate;

  if (!config.animate) {
    chromaEntry?.scrollTrigger?.disable();
    chromaExit?.scrollTrigger?.disable();
    dimmerScrub?.disable();
    scrollerScrub?.disable();
    gsap.set(items, { opacity: 1 });
    gsap.set(document.documentElement, { '--chroma': 0 });
  } else {
    gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });
    dimmerScrub?.enable();
    scrollerScrub?.enable();
    chromaEntry?.scrollTrigger?.enable();
    chromaExit?.scrollTrigger?.enable();
  }
};

// Create Theme Toggle Button (Sun/Moon)
const themeButton = document.createElement('button');
themeButton.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
`;

const getThemeIcon = (theme) => theme === 'dark' ? `
  <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
    <!-- Sun Icon -->
    <circle cx="12" cy="12" r="5" fill="yellow"/>
    <g stroke="orange" stroke-width="2">
      <line x1="12" y1="0" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="24" />
      <line x1="4" y1="12" x2="8" y2="12" />
      <line x1="16" y1="12" x2="20" y2="12" />
      <line x1="3" y1="3" x2="5" y2="5" />
      <line x1="19" y1="3" x2="17" y2="5" />
      <line x1="3" y1="21" x2="5" y2="19" />
      <line x1="19" y1="21" x2="17" y2="19" />
    </g>
  </svg>` : `
  <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
    <!-- Moon Icon -->
    <circle cx="12" cy="12" r="10" fill="gray"/>
    <circle cx="15" cy="10" r="5" fill="white"/>
  </svg>
`;

themeButton.innerHTML = getThemeIcon(config.theme);
document.body.appendChild(themeButton);

themeButton.addEventListener('click', () => {
  config.theme = config.theme === 'dark' ? 'light' : 'dark';
  themeButton.innerHTML = getThemeIcon(config.theme);
  update();
});

// Scroll Animation Setup
let items, scrollerScrub, dimmerScrub, chromaEntry, chromaExit;

if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
  gsap.registerPlugin(ScrollTrigger);

  items = gsap.utils.toArray('ul li');
  gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });

  const dimmer = gsap.timeline()
    .to(items.slice(1), { opacity: 1, stagger: 0.5 })
    .to(items.slice(0, -1), { opacity: 0.2, stagger: 0.5 }, 0);

  dimmerScrub = ScrollTrigger.create({
    trigger: items[0],
    endTrigger: items[items.length - 1],
    start: 'center center',
    end: 'center center',
    animation: dimmer,
    scrub: 0.2,
  });

  const scroller = gsap.timeline().fromTo(
    document.documentElement,
    { '--hue': 0 },
    { '--hue': 1000, ease: 'none' }
  );

  scrollerScrub = ScrollTrigger.create({
    trigger: items[0],
    endTrigger: items[items.length - 1],
    start: 'center center',
    end: 'center center',
    animation: scroller,
    scrub: 0.2,
  });

  chromaEntry = gsap.fromTo(
    document.documentElement,
    { '--chroma': 0 },
    {
      '--chroma': 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: items[0],
        start: 'center center+=40',
        end: 'center center',
        scrub: 0.2,
      },
    }
  );

  chromaExit = gsap.fromTo(
    document.documentElement,
    { '--chroma': 0.3 },
    {
      '--chroma': 0,
      ease: 'none',
      scrollTrigger: {
        trigger: items[items.length - 2],
        start: 'center center',
        end: 'center center-=40',
        scrub: 0.2,
      },
    }
  );
}

// Initial theme/animation setup
update();
