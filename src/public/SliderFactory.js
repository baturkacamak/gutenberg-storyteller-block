class SliderFactory {
	createCategorySwiper(container, initialIndex = 0, eventListeners) {
		return new Swiper(container, {
			slidesPerView: 3,
			spaceBetween: 100,
			autoplay: false,
			centeredSlides: true,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			slideToClickedSlide: true,
			on: {
				init: (swiper) => {
				},
				...eventListeners
			},
		});
	}

	createPostSwiper(container, updateProgressIndicator, categorySwiper, modalContainer) {
		return new Swiper(container, {
			spaceBetween: 0,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
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
				},
			},
			on: {
				reachEnd: async (swiper) => {
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
						document.querySelectorAll('.swiper-pagination-bullet').forEach((bullet) => {
							bullet.classList.remove('swiper-pagination-bullet-active');
							const otherIndicator = bullet.querySelector('.progress-indicator');
							if (otherIndicator !== progressIndicator) {
								otherIndicator.style.width = '0';
							}
						});
					}
				},
			},
		});
	}
}

export default SliderFactory;
