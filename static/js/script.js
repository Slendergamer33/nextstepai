import gsap from 'https://cdn.skypack.dev/gsap@3.12.0';
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger';
import lottie from 'https://cdn.skypack.dev/lottie-web@5.10.1';

// Configuration for theme and animation toggle
const config = {
  theme: 'dark', // Default theme
  animate: true,
};

// Apply theme and animation state to DOM
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

// ==== Create Lottie-based Theme Toggle Button ====
const themeButton = document.createElement('button');
themeButton.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  width: 50px;
  height: 50px;
  z-index: 1000;
`;

const lottieContainer = document.createElement('div');
lottieContainer.style.width = '100%';
lottieContainer.style.height = '100%';
themeButton.appendChild(lottieContainer);
document.body.appendChild(themeButton);

// Load Lottie animation
const animation = lottie.loadAnimation({
  container: lottieContainer,
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'animations/theme-toggle.json' // 👈 Update this if you rename the file
});

animation.goToAndStop(0, true); // Start at dark mode frame

// Toggle theme + play animation on click
themeButton.addEventListener('click', () => {
  const isDark = config.theme === 'dark';
  config.theme = isDark ? 'light' : 'dark';

  if (isDark) {
    animation.playSegments([0, 80], true); // Dark → Light
  } else {
    animation.playSegments([80, 0], true); // Light → Dark
  }

  update();
});

// ==== Scroll Animations Setup ====
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

// Initialize theme and animation state
update();




const ctrl = new Tweakpane.Pane({
  title: 'Config',
  expanded: true,
});

const showNoise = document.querySelector('#noiseshow feTurbulence');
const distortionNoise = document.querySelector('#distortion feTurbulence');
const distortionDisplacement = document.querySelector('#distortion feDisplacementMap');



const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update();
  document.startViewTransition(() => update());
};

const noise = ctrl.addFolder({ title: 'feTurbulence' });
noise.addBinding(config.noise, 'baseFrequency', {
  min: 0,
  step: 0.001,
  max: 0.1,
  label: 'baseFrequency',
});
noise.addBinding(config.noise, 'numOctaves', {
  min: 0,
  step: 1,
  max: 10,
  label: 'numOctaves',
});
noise.addBinding(config.noise, 'seed', {
  min: 0,
  step: 1,
  max: 1000,
  label: 'seed',
});
noise.addBinding(config.noise, 'type', {
  options: {
    fractalNoise: 'fractalNoise',
    turbulence: 'turbulence',
  },
  label: 'type',
});
noise.addBinding(config.noise, 'stitchTiles', {
  options: {
    noStitch: 'noStitch',
    stitch: 'stitch',
  },
  label: 'stitchTiles',
});

const displacement = ctrl.addFolder({ title: 'feDisplacementMap' });
displacement.addBinding(config.displacement, 'scale', {
  min: 0,
  max: 100,
  step: 1,
  label: 'scale',
});

const transforms = ctrl.addFolder({ title: 'transforms' });
transforms.addBinding(config.transforms, 'scale', {
  min: 0,
  max: 2,
  step: 0.1,
  label: 'scale',
});
transforms.addBinding(config.transforms, 'rotation', {
  min: -360,
  max: 360,
  step: 1,
  label: 'rotation',
});

ctrl.addBinding(config, 'debug', {
  label: 'debug',
});

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
});

ctrl.on('change', sync);
update();