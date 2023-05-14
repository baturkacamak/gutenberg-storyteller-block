class EventController {
	domHelper;

	constructor(storyManager, domHelper) {
		this.domHelper = domHelper;
		this.storyManager = storyManager;
	}

	getCategorySwiperEventListeners(initialIndex, modalContainer, categories, swiperContainer) {
		return {
			beforeInit: async (swiper) => {
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

				swiper.slides.forEach((slide) => {
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
			slideChange: async (swiper) => {
				const currentIndex = swiper.activeIndex;
				const categoryId = swiper.slides[currentIndex].getAttribute('data-category-id');
				const storyContainer = this.domHelper.querySelector('.storyteller-story-container', swiper.slides[currentIndex]);

				await this.storyManager.fetchPostsAndCreateStory(categoryId, storyContainer, swiper, modalContainer);

				// Initialize adjacent slides
				await this.storyManager.initializeAdjacentSlides(swiper, currentIndex, modalContainer);

				// Stop autoplay for all slides
				swiper.slides.forEach((slide) => {
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
			},
		};
	}
}

export default EventController;
