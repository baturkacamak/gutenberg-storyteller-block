class StoryManager {
	sliderFactory;

	constructor(fetcher, uiHandler, domHelper, sliderFactory) {
		this.sliderFactory = sliderFactory;
		this.fetcher = fetcher;
		this.uiHandler = uiHandler;
		this.domHelper = domHelper;
		this.interval;
	}

	updateProgressIndicator = (swiper) => {
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
		const imageLoadPromises = Array.from(imageElements).map((img) => {
			return new Promise((resolve) => {
				img.onload = () => resolve();
				img.src = img.getAttribute('data-src');
			});
		});

		await Promise.all(imageLoadPromises);

		const postSwiper = this.sliderFactory.createPostSwiper(this.domHelper.querySelector('.swiper', storyContainer), this.updateProgressIndicator, categorySwiper, modalContainer);
	}

	async initializeAdjacentSlides(swiper, currentIndex, modalContainer) {
		const categories = swiper.slides;
		const slidesToInitialize = [
			currentIndex - 1, // Previous slide
			currentIndex + 1, // Next slide
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

export default StoryManager;
