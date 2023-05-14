/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/public/DomHelper.js":
/*!*********************************!*\
  !*** ./src/public/DomHelper.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ DomHelper; }
/* harmony export */ });
/**
 * @class DomHelper
 * @desc A class for providing a simplified and consistent interface for manipulating the DOM
 */
class DomHelper {
  /**
   * @function querySelector
   * @desc Wrapper function for `document.querySelector`
   * @param {string} selector - The CSS selector to query
   * @param {HTMLElement} [context=document] - The context element to search within
   * @returns {HTMLElement} - The first element matching the selector
   */
  querySelector(selector) {
    let context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return context.querySelector(selector);
  }

  /**
   * @function querySelectorAll
   * @desc Wrapper function for `document.querySelectorAll`
   * @param {string} selector - The CSS selector to query
   * @param {HTMLElement} [context=document] - The context element to search within
   * @returns {NodeList} - A list of elements matching the selector
   */
  querySelectorAll(selector) {
    let context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return context.querySelectorAll(selector);
  }

  /**
   * @function createElement
   * @desc Wrapper function for `document.createElement`
   * @param {string} tagName - The name of the element to create
   * @returns {HTMLElement} - The created element
   */
  createElement(tagName) {
    return document.createElement(tagName);
  }

  /**
   * @function addClass
   * @desc Adds one or more classes to an element
   * @param {HTMLElement} element - The element to add the classes to
   * @param {...string} classNames - The classes to add
   */
  addClass(element) {
    for (var _len = arguments.length, classNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      classNames[_key - 1] = arguments[_key];
    }
    element.classList.add(...classNames);
  }

  /**
   * @function removeClass
   * @desc Removes a class from an element
   * @param {HTMLElement} element - The element to remove the class from
   * @param {string} className - The class to remove
   */
  removeClass(element, className) {
    element.classList.remove(className);
  }

  /**
   * @function hasClass
   * @desc Check if an element has a class
   * @param {HTMLElement} element - The element to check
   * @param {string} className - The class to check for
   * @returns {boolean} - Whether the element has the class or not
   */
  hasClass(element, className) {
    return element.classList.contains(className);
  }

  /**
   * @function toggleClass
   * @desc Toggles a class on an element
   * @param {HTMLElement} element - The element to toggle the class on
   * @param {string} className - The class to toggle
   */
  toggleClass(element, className) {
    element.classList.toggle(className);
  }

  /**
   * @function appendChild
   * @desc Wrapper function for `HTMLElement.appendChild`
   * @param {HTMLElement} parent - The parent element
   * @param {HTMLElement} child - The child element to append
   */
  appendChild(parent, child) {
    parent.appendChild(child);
  }

  /**
   * @function removeChild
   * @desc Wrapper function for `HTMLElement.removeChild`
   * @param {HTMLElement} parent - The parent element
   * @param {HTMLElement} child - The child element to remove
   */
  removeChild(parent, child) {
    parent.removeChild(child);
  }

  /**
   * @function addEventListener
   * @desc Wrapper function for `HTMLElement.addEventListener`
   * @param {HTMLElement} element - The element to add the event listener to
   * @param {string} event - The event to listen for
   * @param {function} callback - The function to call when the event is triggered
   */
  addEventListener(element, event, callback) {
    element.addEventListener(event, callback);
  }
}

/***/ }),

/***/ "./src/public/EventController.js":
/*!***************************************!*\
  !*** ./src/public/EventController.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class EventController {
  domHelper;
  constructor(storyManager, domHelper) {
    this.domHelper = domHelper;
    this.storyManager = storyManager;
  }
  getCategorySwiperEventListeners(initialIndex, modalContainer, categories, swiperContainer) {
    return {
      beforeInit: async swiper => {
        // Initialize the first category's inner Swiper
        const firstCategoryId = categories[initialIndex].id;
        const firstStoryContainer = this.domHelper.querySelector(`.swiper-slide[data-category-id="${firstCategoryId}"] .storyteller-story-container`, swiperContainer);
        await this.storyManager.fetchPostsAndCreateStory(firstCategoryId, firstStoryContainer);
        for (let i = Math.max(initialIndex - 1, 0); i <= Math.min(initialIndex + 1, categories.length - 1); i++) {
          const categoryId = categories[i].id;
          const storyContainer = this.domHelper.querySelector('.storyteller-story-container', swiper.slides[i]);
          await this.storyManager.fetchPostsAndCreateStory(categoryId, storyContainer, swiper, modalContainer);
        }
        swiper.slideTo(initialIndex);
        swiper.slides.forEach(slide => {
          if (this.domHelper.querySelector('.swiper', slide)) {
            const storySwiper = this.domHelper.querySelector('.swiper', slide).swiper;
            if (storySwiper) {
              storySwiper.autoplay.stop();
            }
          }
        });

        // Start autoplay for the first active slide
        const firstActiveStorySwiper = this.domHelper.querySelector('.swiper', firstStoryContainer).swiper;
        if (firstActiveStorySwiper) {
          console.log(firstActiveStorySwiper);
          firstActiveStorySwiper.autoplay.start();
        }
      },
      slideChange: async swiper => {
        const currentIndex = swiper.activeIndex;
        const categoryId = swiper.slides[currentIndex].getAttribute('data-category-id');
        const storyContainer = this.domHelper.querySelector('.storyteller-story-container', swiper.slides[currentIndex]);
        await this.storyManager.fetchPostsAndCreateStory(categoryId, storyContainer, swiper, modalContainer);

        // Initialize adjacent slides
        await this.storyManager.initializeAdjacentSlides(swiper, currentIndex, modalContainer);

        // Stop autoplay for all slides
        swiper.slides.forEach(slide => {
          if (this.domHelper.querySelector('.swiper', slide)) {
            const storySwiper = this.domHelper.querySelector('.swiper', slide).swiper;
            if (storySwiper) {
              storySwiper.autoplay.stop();
            }
          }
        });

        // Start autoplay for the active slide
        const activeSlide = swiper.slides[swiper.realIndex];
        const activeStorySwiper = this.domHelper.querySelector('.storyteller-story-container .swiper', activeSlide).swiper;
        if (activeStorySwiper) {
          activeStorySwiper.autoplay.start();
        }
      }
    };
  }
}
/* harmony default export */ __webpack_exports__["default"] = (EventController);

/***/ }),

/***/ "./src/public/Fetcher.js":
/*!*******************************!*\
  !*** ./src/public/Fetcher.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// Fetcher.js
class Fetcher {
  async fetchCategories(categoryIds) {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      throw new Error('Invalid categoryIds provided');
    }
    const response = await fetch(`/wp-json/wp/v2/categories?include=${categoryIds.join(',')}`);
    const categories = await response.json();
    return categories;
  }
  async fetchPosts(categoryId) {
    if (!categoryId) {
      throw new Error('Invalid categoryId provided');
    }
    const response = await fetch(`/wp-json/wp/v2/posts?categories=${categoryId}&_embed`);
    const posts = await response.json();
    return posts;
  }
}
/* harmony default export */ __webpack_exports__["default"] = (Fetcher);

/***/ }),

/***/ "./src/public/SliderFactory.js":
/*!*************************************!*\
  !*** ./src/public/SliderFactory.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class SliderFactory {
  createCategorySwiper(container) {
    let initialIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    let eventListeners = arguments.length > 2 ? arguments[2] : undefined;
    return new Swiper(container, {
      slidesPerView: 3,
      spaceBetween: 100,
      autoplay: false,
      centeredSlides: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      slideToClickedSlide: true,
      on: {
        init: swiper => {},
        ...eventListeners
      }
    });
  }
  createPostSwiper(container, updateProgressIndicator, categorySwiper, modalContainer) {
    return new Swiper(container, {
      spaceBetween: 0,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: ".swiper-pagination",
        bulletActiveClass: 'swiper-pagination-bullet-active bg-zinc-500/[.6]',
        bulletClass: 'swiper-pagination-bullet bg-zinc-500',
        clickable: true,
        renderBullet: function (index, className) {
          return `<div class="${className} flex-1 h-1 !rounded-none !my-0 !mx-px flex-1 relative">
                    <div class="story-progress progress-indicator h-full bg-white absolute inset-x-0"></div>
                  </div>`;
        }
      },
      on: {
        reachEnd: async swiper => {
          categorySwiper.slideNext();
          if (categorySwiper.isEnd && this.isEnd) {
            modalContainer.remove();
          }
        },
        autoplayTimeLeft(swiper, time, progress) {
          const bullets = swiper.el.querySelectorAll('.swiper-pagination-bullet');
          const activeBullet = bullets[swiper.realIndex];
          const progressIndicator = activeBullet.querySelector('.progress-indicator', activeBullet);
          if (progress < 1) {
            let percentage = parseInt(100 - progress * 100);
            if (progressIndicator) {
              progressIndicator.style.width = percentage + '%';
            }
          } else {
            // Reset other progress indicators
            document.querySelectorAll('.swiper-pagination-bullet').forEach(bullet => {
              bullet.classList.remove('swiper-pagination-bullet-active');
              const otherIndicator = bullet.querySelector('.progress-indicator');
              if (otherIndicator !== progressIndicator) {
                otherIndicator.style.width = '0';
              }
            });
          }
        }
      }
    });
  }
}
/* harmony default export */ __webpack_exports__["default"] = (SliderFactory);

/***/ }),

/***/ "./src/public/StoryManager.js":
/*!************************************!*\
  !*** ./src/public/StoryManager.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class StoryManager {
  sliderFactory;
  constructor(fetcher, uiHandler, domHelper, sliderFactory) {
    this.sliderFactory = sliderFactory;
    this.fetcher = fetcher;
    this.uiHandler = uiHandler;
    this.domHelper = domHelper;
    this.interval;
  }
  updateProgressIndicator = swiper => {
    const activeNavItem = swiper.el.querySelector('.swiper-pagination-bullet-active');
    console.log(activeNavItem);
    activeNavItem.classList.remove('swiper-pagination-bullet-active');
    // activeNavItem.style.animation = 'none';

    setTimeout(() => {
      activeNavItem.classList.add('swiper-pagination-bullet-active');
      // activeNavItem.style.animation = '';
    }, 10);
    // clearInterval(this.interval);
    //
    // const bullets = this.domHelper.querySelectorAll('.swiper-pagination-bullet', swiper.el);
    // const activeBullet = bullets[swiper.realIndex];
    // const progressIndicator = this.domHelper.querySelector('.progress-indicator', activeBullet);
    //
    // // Reset other progress indicators
    // this.domHelper.querySelectorAll('.swiper-pagination-bullet').forEach((bullet) => {
    // 	const otherIndicator = this.domHelper.querySelector('.progress-indicator', bullet);
    // 	if (otherIndicator !== progressIndicator) {
    // 		otherIndicator.style.width = '0';
    // 	}
    // });
    //
    // const timeLeft = 3000;
    // const intervalDuration = 100; // Interval duration in milliseconds
    // const totalIntervals = timeLeft / intervalDuration;
    // const progressIncrement = 100 / totalIntervals;
    // let progress = 0;
    // this.interval = setInterval(() => {
    // 	progress += progressIncrement;
    // 	progress = parseInt(progress);
    // 	if (progress >= 100) {
    // 		progress = 100;
    // 		clearInterval(this.interval);
    // 	}
    //
    // 	if (progressIndicator) {
    // 		progressIndicator.style.width = progress + '%';
    // 	}
    // }, intervalDuration);
  };

  async fetchPostsAndCreateStory(categoryId, storyContainer, categorySwiper, modalContainer) {
    const posts = await this.fetcher.fetchPosts(categoryId);
    this.uiHandler.createStoryContainer(storyContainer, posts);

    // Wait for all images to load
    const imageElements = this.domHelper.querySelectorAll('img[data-src]', storyContainer);
    const imageLoadPromises = Array.from(imageElements).map(img => {
      return new Promise(resolve => {
        img.onload = () => resolve();
        img.src = img.getAttribute('data-src');
      });
    });
    await Promise.all(imageLoadPromises);
    const postSwiper = this.sliderFactory.createPostSwiper(this.domHelper.querySelector('.swiper', storyContainer), this.updateProgressIndicator, categorySwiper, modalContainer);
  }
  async initializeAdjacentSlides(swiper, currentIndex, modalContainer) {
    const categories = swiper.slides;
    const slidesToInitialize = [currentIndex - 1,
    // Previous slide
    currentIndex + 1 // Next slide
    ];

    for (let i of slidesToInitialize) {
      if (i >= 0 && i < categories.length) {
        const slide = categories[i];
        const categoryId = slide.getAttribute('data-category-id');
        const storyContainer = this.domHelper.querySelector('.storyteller-story-container', slide);

        // Check if the slide is not initialized
        if (!storyContainer.innerHTML) {
          await this.fetchPostsAndCreateStory(categoryId, storyContainer, swiper, modalContainer);
        }
      }
    }
  }
}
/* harmony default export */ __webpack_exports__["default"] = (StoryManager);

/***/ }),

/***/ "./src/public/StoryTellerFacade.js":
/*!*****************************************!*\
  !*** ./src/public/StoryTellerFacade.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _StoryManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StoryManager */ "./src/public/StoryManager.js");
/* harmony import */ var _EventController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EventController */ "./src/public/EventController.js");


class StoryTellerFacade {
  constructor(fetcher, sliderFactory, uiHandler, domHelper) {
    this.fetcher = fetcher;
    this.sliderFactory = sliderFactory;
    this.uiHandler = uiHandler;
    this.domHelper = domHelper;
    this.storyManager = new _StoryManager__WEBPACK_IMPORTED_MODULE_0__["default"](fetcher, uiHandler, domHelper, sliderFactory);
    this.eventController = new _EventController__WEBPACK_IMPORTED_MODULE_1__["default"](this.storyManager, domHelper);
  }
  async initCategorySwiper() {
    let initialIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    const categoryIds = Array.from(this.domHelper.querySelectorAll('[data-category-id]')).map(el => el.dataset.categoryId);
    const categories = await this.fetcher.fetchCategories(categoryIds);
    const modalContainer = this.uiHandler.createModalContainer();
    const swiperContainer = this.uiHandler.createCategorySwiperContainer(modalContainer, categories);
    const eventListeners = this.eventController.getCategorySwiperEventListeners(initialIndex, modalContainer, categories, swiperContainer);
    const categorySwiper = this.sliderFactory.createCategorySwiper(swiperContainer, initialIndex, eventListeners);

    // Add modal close logic on Escape key press
    this.uiHandler.addModalCloseListener(modalContainer);
  }
}
/* harmony default export */ __webpack_exports__["default"] = (StoryTellerFacade);

/***/ }),

/***/ "./src/public/UIHandler.js":
/*!*********************************!*\
  !*** ./src/public/UIHandler.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DomHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DomHelper */ "./src/public/DomHelper.js");

class UIHandler {
  constructor() {
    this.domHelper = new _DomHelper__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }
  createModalContainer() {
    const modalContainer = this.domHelper.createElement('div');
    this.domHelper.addClass(modalContainer, 'storyteller-modal-container', 'fixed', 'inset-0', 'z-50', 'max-w-full', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-75');
    this.domHelper.appendChild(document.body, modalContainer);
    return modalContainer;
  }
  createStoryContainer(storyContainer, posts) {
    // Update the story container with the slider
    storyContainer.innerHTML = `
	  <div class="swiper">
		<div class="swiper-wrapper">
		  ${posts.map(post => `
			<div class="swiper-slide">
			  <a href="${post.link}" target="_blank">
				<div class="storyteller-story-item flex items-center justify-center">
				  <img class="w-full" data-src="${post._embedded['wp:featuredmedia'][0].media_details.sizes['instagram-story'].source_url}" alt="${post.title.rendered}">
				</div>
			  </a>
			</div>`).join('')}
		</div>
		<div class="swiper-button-next"></div>
		<div class="swiper-button-prev"></div>
		<div class="swiper-pagination !top-2 !bottom-auto flex h-1 justify-center px-px"></div>
	  </div>
	`;
    return storyContainer;
  }
  createCategorySwiperContainer(modalContainer, categories) {
    const categorySwiperContainer = this.domHelper.createElement('div');
    this.domHelper.addClass(categorySwiperContainer, 'swiper-container', 'max-w-full');
    categorySwiperContainer.innerHTML = `
    <div class="swiper-wrapper swiper-wrapper-category">
      ${categories.map(category => `
        <div class="swiper-slide" data-category-id="${category.id}">
          <div class="storyteller-story-container h-screen"></div>
        </div>`).join('')}
    </div>
  `;
    // Append the category swiper container to the modal container
    this.domHelper.appendChild(modalContainer, categorySwiperContainer);
    return categorySwiperContainer;
  }
  updateProgressIndicator(swiper, interval) {
    clearInterval(interval);
    const bullets = this.domHelper.querySelectorAll('.swiper-pagination-bullet', swiper.el);
    const activeBullet = bullets[swiper.realIndex];
    const progressIndicator = this.domHelper.querySelector('.progress-indicator', activeBullet);

    // Reset other progress indicators
    this.domHelper.querySelectorAll('.swiper-pagination-bullet').forEach(bullet => {
      const otherIndicator = this.domHelper.querySelector('.progress-indicator', bullet);
      if (otherIndicator !== progressIndicator) {
        otherIndicator.style.width = '0';
      }
    });
    const timeLeft = swiper.autoplay.timeLeft;
    const intervalDuration = 10; // Interval duration in milliseconds
    const totalIntervals = timeLeft / intervalDuration;
    const progressIncrement = 100 / totalIntervals;
    let progress = 0;
    interval = setInterval(() => {
      progress += progressIncrement;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      if (progressIndicator) {
        progressIndicator.style.width = progress + '%';
      }
    }, intervalDuration);
    return interval;
  }
  addModalCloseListener(modalContainer) {
    // Close the modal when the Esc key is pressed
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        modalContainer.remove();
      }
    });
  }
}
/* harmony default export */ __webpack_exports__["default"] = (UIHandler);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!***********************************!*\
  !*** ./src/public/StoryTeller.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Fetcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Fetcher */ "./src/public/Fetcher.js");
/* harmony import */ var _SliderFactory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SliderFactory */ "./src/public/SliderFactory.js");
/* harmony import */ var _UIHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UIHandler */ "./src/public/UIHandler.js");
/* harmony import */ var _DomHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DomHelper */ "./src/public/DomHelper.js");
/* harmony import */ var _StoryTellerFacade__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./StoryTellerFacade */ "./src/public/StoryTellerFacade.js");
// Import the necessary classes




 // Import the StoryTellerFacade class
// Import the other classes if necessary (StoryManager and EventController)

// Instantiate the required classes
const fetcher = new _Fetcher__WEBPACK_IMPORTED_MODULE_0__["default"]();
const sliderFactory = new _SliderFactory__WEBPACK_IMPORTED_MODULE_1__["default"]();
const uiHandler = new _UIHandler__WEBPACK_IMPORTED_MODULE_2__["default"]();
const domHelper = new _DomHelper__WEBPACK_IMPORTED_MODULE_3__["default"]();

// Instantiate the StoryTellerFacade class
const storyTellerFacade = new _StoryTellerFacade__WEBPACK_IMPORTED_MODULE_4__["default"](fetcher, sliderFactory, uiHandler, domHelper);

// Attach click event listeners to the grid items
document.querySelectorAll('.storyteller-grid-item').forEach((item, index) => {
  item.addEventListener('click', async e => {
    e.preventDefault();
    await storyTellerFacade.initCategorySwiper(index);
  });
});
}();
/******/ })()
;
//# sourceMappingURL=story-teller.js.map