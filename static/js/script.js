import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger';

// Config object to store the theme state
const config = {
  theme: 'dark', // Default theme is dark
  animate: true,
};

// Function to update the theme
const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.animate = config.animate;

  if (!config.animate) {
    // Disable animations if not active
    chromaEntry?.scrollTrigger.disable(true, false);
    chromaExit?.scrollTrigger.disable(true, false);
    dimmerScrub?.disable(true, false);
    scrollerScrub?.disable(true, false);
    gsap.set(items, { opacity: 1 });
    gsap.set(document.documentElement, { '--chroma': 0 });
  } else {
    gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });
    dimmerScrub.enable(true, true);
    scrollerScrub.enable(true, true);
    chromaEntry.scrollTrigger.enable(true, true);
    chromaExit.scrollTrigger.enable(true, true);
  }
};

// Add the sun/moon toggle button to the HTML body using inline SVG
const themeButton = document.createElement('button');
themeButton.style.position = 'fixed';
themeButton.style.top = '10px';
themeButton.style.right = '10px';
themeButton.style.border = 'none';
themeButton.style.background = 'transparent';
themeButton.style.cursor = 'pointer';
themeButton.style.padding = '0'; // Remove padding for cleaner look
themeButton.innerHTML = `
  <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
    <!-- Sun Icon (default) -->
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
  </svg>`;

// Append the button to the body
document.body.appendChild(themeButton);

// Toggle between light and dark theme
themeButton.addEventListener('click', () => {
  // Switch the theme
  config.theme = config.theme === 'dark' ? 'light' : 'dark';
  // Update the button icon based on the current theme
  const themeIcon = document.getElementById('theme-icon');
  themeIcon.innerHTML = config.theme === 'dark' ? `
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
  ` : `
    <!-- Moon Icon -->
    <circle cx="12" cy="12" r="5" fill="gray"/>
    <circle cx="14" cy="8" r="4" fill="white"/>
  `;
  update();
});

let items;
let scrollerScrub;
let dimmerScrub;
let chromaEntry;
let chromaExit;

// Backfill the scroll functionality with GSAP
if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
  gsap.registerPlugin(ScrollTrigger);

  items = gsap.utils.toArray('ul li');
  gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });

  const dimmer = gsap
    .timeline()
    .to(items.slice(1), {
      opacity: 1,
      stagger: 0.5,
    })
    .to(
      items.slice(0, items.length - 1),
      {
        opacity: 0.2,
        stagger: 0.5,
      },
      0
    );

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
    {
      '--hue': 0,
    },
    {
      '--hue': 1000,
      ease: 'none',
    }
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
    {
      '--chroma': 0,
    },
    {
      '--chroma': 0.3,
      ease: 'none',
      scrollTrigger: {
        scrub: 0.2,
        trigger: items[0],
        start: 'center center+=40',
        end: 'center center',
      },
    }
  );

  chromaExit = gsap.fromTo(
    document.documentElement,
    {
      '--chroma': 0.3,
    },
    {
      '--chroma': 0,
      ease: 'none',
      scrollTrigger: {
        scrub: 0.2,
        trigger: items[items.length - 2],
        start: 'center center',
        end: 'center center-=40',
      },
    }
  );
}

// Initial update to apply the default theme
update();
