import DomHelper from './DomHelper';

class UIHandler {
	constructor() {
		this.domHelper = new DomHelper();
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
		  ${posts.map((post) => `
			<div class="swiper-slide">
			  <a href="${post.link}" target="_blank">
				<div class="storyteller-story-item flex items-center justify-center">
				  <img class="w-full" data-src="${post._embedded['wp:featuredmedia'][0].media_details.sizes['instagram-story'].source_url}" alt="${post.title.rendered}">
				</div>
			  </a>
			</div>`
		)
			.join('')}
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
      ${categories.map(
			(category) => `
        <div class="swiper-slide" data-category-id="${category.id}">
          <div class="storyteller-story-container h-screen"></div>
        </div>`
		).join('')}
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
		this.domHelper.querySelectorAll('.swiper-pagination-bullet').forEach((bullet) => {
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

export default UIHandler;
