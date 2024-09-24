'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////////
const allSections = document.querySelectorAll('.section');

const allButtons = document.getElementsByTagName('button');

const header = document.querySelector('.header');
const footer = document.querySelector('.footer');

/////////////////////////////
// Creating cookie message //
/////////////////////////////

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.prepend(message);
// footer.append(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

///////////////
// Scrolling //
///////////////

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();

  // Old way to scroll
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern way to scroll
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////
// Event Delegation to achieve page navigation //
/////////////////////////////////////////////////

// NON prof. way

// document.querySelectorAll('.nav__link').forEach(link =>
//   link.addEventListener('click', function (e) {
//     e.preventDefault();

//     // Smooth navigation
//     const id = this.getAttribute('href'); // href for every link which is the id for every section
//     console.log(id);

//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

// Prof. way

// 1. Add event listener to common parent element
// 2. Determine what element originated the event
const parentLinksEl = document.querySelector('.nav__links');
parentLinksEl.addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (!id) return;
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////
// Tabbed Component //
//////////////////////

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clickedTab = e.target.closest('.operations__tab');
  // Guard clause
  if (!clickedTab) return;
  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  // Active tab
  clickedTab.classList.add('operations__tab--active');
  // Active content area
  document
    .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////
// Nav fade animation //
////////////////////////

const handlerHover = function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const clickedLink = e.target;
    const navLinks = clickedLink.closest('.nav').querySelectorAll('.nav__link');
    const logo = clickedLink.closest('.nav').querySelector('img');

    navLinks.forEach(link => {
      if (link !== clickedLink) link.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
const nav = document.querySelector('.nav');
// Passing "argument" into handler only using this keyword
nav.addEventListener('mouseover', handlerHover.bind(0.5));
nav.addEventListener('mouseout', handlerHover.bind(1));

///////////////////////
// Sticky navigation //
///////////////////////

// NON efficient way

// const initCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (this.window.scrollY > initCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Modern way (Intersection Observer API)

const navHeight = nav.getBoundingClientRect().height;
const obsCallback = function (entriesArr) {
  // entries : threshold's values each one alone
  const [entries] = entriesArr;
  if (!entries.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const obsOptions = {
  root: null, // the element that target (header) intersecting ==> null : the entire viewport
  threshold: [0, 0.2], // percentage of intersection at which the (obsCallback) will be called
  rootMargin: `-${navHeight}px`, // Margin applied outside of target element
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

//////////////////////////////////
// Reveal sections on scrolling //
//////////////////////////////////

const revealSection = function (entryArr, observer) {
  const [entry] = entryArr;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // To prevent observer callback function after it runs once
};
const revealOptions = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(revealSection, revealOptions);

allSections.forEach(function (section) {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

/////////////////////////
// Lazy loading images //
/////////////////////////

const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entryArr, observer) {
  const [entry] = entryArr;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.1,
  // rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////
// Slider component //
//////////////////////

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const slidesNum = slides.length;

const sliderization = function () {
  // slider.style.overflow = 'visible';

  // slides.forEach(
  //   (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
  // );

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide-num="${i}"></button>`
      );
    });
  };

  const goToSlide = function (slideNum) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - slideNum)}%)`)
    );
  };

  const activateDot = function (slideNum) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide-num="${slideNum}"]`)
      .classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    if (curSlide === slidesNum - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = slidesNum - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Initial conditions
  const init = function () {
    createDots(); // Creating slides dots
    goToSlide(0); // Initial slide condition
    activateDot(0); // Initial dot condition
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // Short circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slideNum } = e.target.dataset;
      goToSlide(slideNum);
      activateDot(slideNum);
    }
  });

  //////////////////////////////////////////////////////////
  // Swipe and scroll touchable devices and mouse-devices //
  //////////////////////////////////////////////////////////

  // Initial mouse X and Y positions are 0
  let mouseX,
    initialX = 0;
  let mouseY,
    initialY = 0;
  let isSwiped;

  // Initial swipe conditions
  let swipeDirection = 'Middle'; //idle
  let lastSwipe = 9999;
  let swipeIdleTime = 200; // time interval that we consider a new scroll event

  // Events for touch and mouse
  let events = {
    mouse: {
      down: 'mousedown',
      move: 'mousemove',
      up: 'mouseup',
      scroll: 'wheel',
    },
    touch: {
      down: 'touchstart',
      move: 'touchmove',
      up: 'touchend',
      scroll: 'wheel',
    },
  };

  let deviceType = '';

  // Detect touch device
  const isTouchDevice = () => {
    try {
      // We try to create TouchEvent (it would fail for desktops and throw error)
      document.createEvent('TouchEvent');
      deviceType = 'touch';
      return true;
    } catch (e) {
      deviceType = 'mouse';
      return false;
    }
  };

  // Get left and top of touched element
  slides.forEach(slide => {
    let rectLeft = slide.getBoundingClientRect().left;
    let rectTop = slide.getBoundingClientRect().top;

    // Get exact X and Y positions of mouse/touch
    const getXY = e => {
      mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft;
      mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop;
    };

    isTouchDevice();

    // Start swipe
    slide.addEventListener(events[deviceType].down, ev => {
      isSwiped = true;

      // Get X and Y position
      getXY(ev);
      initialX = mouseX;
      initialY = mouseY;
    });

    // Mousemove / touchmove
    slide.addEventListener(events[deviceType].move, ev => {
      if (!isTouchDevice()) {
        ev.preventDefault();
      }

      let timeNow = performance.now();

      if (isSwiped) {
        getXY(ev);
        let diffX = mouseX - initialX;
        let diffY = mouseY - initialY;

        if (Math.abs(diffY) > Math.abs(diffX)) {
          const vSwipe = diffY > 0 ? 'Down' : 'Up';
          console.log(vSwipe);
        }
        if (Math.abs(diffY) < Math.abs(diffX)) {
          const hSwipe = diffX > 0 ? 'Right' : 'Left';
          console.log(hSwipe);

          if (
            diffX > 0 &&
            (swipeDirection !== 'Right' || timeNow > lastSwipe + swipeIdleTime)
          ) {
            prevSlide();
            swipeDirection = 'Right';
          }

          if (
            diffX < 0 &&
            (swipeDirection !== 'Left' || timeNow > lastSwipe + swipeIdleTime)
          ) {
            nextSlide();
            swipeDirection = 'Left';
          }
        }
      }
      lastSwipe = timeNow;
    });

    // End swipe
    slide.addEventListener(events[deviceType].up, () => {
      isSwiped = false;
    });
    slide.addEventListener('mouseleave', () => {
      isSwiped = false;
    });

    // Scrolling
    slide.addEventListener(events[deviceType].scroll, ev => {
      let timeNow = performance.now();
      let { deltaX } = ev;

      if (
        deltaX < 0 &&
        (swipeDirection !== 'Right' || timeNow > lastSwipe + swipeIdleTime)
      ) {
        prevSlide();
        swipeDirection = 'Right';
      }

      if (
        deltaX > 0 &&
        (swipeDirection !== 'Left' || timeNow > lastSwipe + swipeIdleTime)
      ) {
        nextSlide();
        swipeDirection = 'Left';
      }

      lastSwipe = timeNow;
    });
  });

  window.onload = () => {
    isSwiped = false;
  };

  /*
  ///////////////////////////////
  // Touch slider(Not desktop) //
  ///////////////////////////////

  let start;
  let end;
  slides.forEach(slide => {
    slide.addEventListener('touchstart', e => {
      start = e.touches[0].clientX;
    });
    slide.addEventListener('touchend', e => {
      end = e.changedTouches[0].clientX;
      const diff = end - start;

      if (diff > 0) {
        prevSlide();
      }

      if (diff < 0) {
        nextSlide();
      }
    });
  });

  //////////////////////
  // Scrolling slider //
  //////////////////////

  let scrollingDirection = 'Middle'; //idle
  let lastScroll = 9999;
  let scrollIdleTime = 200; // time interval that we consider a new scroll event

  function doScroll(e) {
    // e.preventDefault(); // disable the actual scrolling
    // positive deltas are top and left
    // down and right are negative

    // horizontal offset    e.deltaX
    // vertical offset      e.deltaY

    let delta = e.deltaX;
    let timeNow = performance.now();
    if (
      delta < 0 &&
      (scrollingDirection !== 'Right' || timeNow > lastScroll + scrollIdleTime)
    ) {
      prevSlide();
      scrollingDirection = 'Right';
    } 
    if (
      delta > 0 &&
      (scrollingDirection !== 'Left' || timeNow > lastScroll + scrollIdleTime)
    ) {
      nextSlide();
      scrollingDirection = 'Left';
    }
    lastScroll = timeNow;
  }

  slides.forEach(slide => slide.addEventListener('wheel', doScroll, false));
  
  */
};
sliderization();

/*
///////////////////////////////////////////////
// Swipe touchable devices and mouse-devices //
///////////////////////////////////////////////

// Initial mouse X and Y positions are 0
const el = document.querySelector('.class of scrolled element');
let mouseX,
  initialX = 0;
let mouseY,
  initialY = 0;
let isSwiped;

// Events for touch and mouse
let events = {
  mouse: {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
  },
  touch: {
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend',
  },
};

let deviceType = '';

// Detect touch device
const isTouchDevice = () => {
  try {
    // We try to create TouchEvent (it would fail for desktops and throw error)
    document.createEvent('TouchEvent');
    deviceType = 'touch';
    return true;
  } catch (e) {
    deviceType = 'mouse';
    return false;
  }
};

// console.log(isTouchDevice());

// Get left and top of touched element
let rectLeft = el.getBoundingClientRect().left;
let rectTop = el.getBoundingClientRect().top;

// Get exact X and Y positions of mouse/touch
const getXY = e => {
  mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft;
  mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop;
};

isTouchDevice();

// Start swipe
el.addEventListener(events[deviceType].down, ev => {
  isSwiped = true;

  // Get X and Y position
  getXY(ev);
  initialX = mouseX;
  initialY = mouseY;
});

// Mousemove / touchmove
el.addEventListener(events[deviceType].move, ev => {
  if (!isTouchDevice()) {
    ev.preventDefault();
  }

  if (isSwiped) {
    getXY(ev);
    let diffX = mouseX - initialX;
    let diffY = mouseY - initialY;

    if (Math.abs(diffY) > Math.abs(diffX)) {
      const verticalSwipe = diffY > 0 ? 'Down' : 'Up';
      console.log(verticalSwipe);
    } else {
      const horizontalSwipe = diffX > 0 ? 'Right' : 'Left';
      console.log(horizontalSwipe);
    }
  }
});

// Stop drawing
el.addEventListener(events[deviceType].up, () => {
  isSwiped = false;
});

el.addEventListener('mouseleave', () => {
  isSwiped = false;
});

window.onload = () => {
  isSwiped = false;
};
*/
