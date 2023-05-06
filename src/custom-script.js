// Function to fetch posts from a category and create the story slider
async function fetchPostsAndCreateStory(categoryId, storyContainer) {
	const response = await fetch('/wp-json/wp/v2/posts?categories=' + categoryId + '&_embed');
	const posts = await response.json();

	// Update the story container with the slider
	storyContainer.innerHTML = `
    <div class="swiper h-full">
      <div class="swiper-wrapper">
        ${posts
		.map(
			(post) => `
          <div class="swiper-slide h-full">
            <div class="storyteller-story-item h-full flex items-center justify-center">
              <img data-src="${post._embedded['wp:featuredmedia'][0].source_url}" alt="${post.title.rendered}">
            </div>
          </div>`
		)
		.join('')}
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
  `;

	// Wait for all images to load
	const imageElements = storyContainer.querySelectorAll('img[data-src]');
	const imageLoadPromises = Array.from(imageElements).map((img) => {
		return new Promise((resolve) => {
			img.onload = () => resolve();
			img.src = img.getAttribute('data-src');
		});
	});

	await Promise.all(imageLoadPromises);

	// Initialize the Swiper.js slider
	const swiper = new Swiper(storyContainer.querySelector('.swiper'), {
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});
}

async function initCategorySwiper() {
	const response = await fetch('/wp-json/wp/v2/categories');
	const categories = await response.json();

	// Create the full-screen modal container
	const modalContainer = document.createElement('div');
	modalContainer.classList.add('storyteller-modal-container', 'fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-75');

	const categorySwiperContainer = document.createElement('div');
	categorySwiperContainer.classList.add('swiper-container');
	categorySwiperContainer.innerHTML = `
    <div class="swiper-wrapper">
      ${categories.map(
		(category) => `
        <div class="swiper-slide" data-category-id="${category.id}">
          <div class="storyteller-story-container h-full"></div>
        </div>`
	).join('')}
    </div>
    <div class="swiper-pagination"></div>
  `;

	// Append the category swiper container to the modal container
	modalContainer.appendChild(categorySwiperContainer);

	// Append the modal container to the body
	document.body.appendChild(modalContainer);

	const categorySwiper = new Swiper('.swiper-container', {
		slidesPerView: 3,
		spaceBetween: 30,
		centeredSlides: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		on: {
			slideChange: async function () {
				const categoryId = this.slides[this.activeIndex].getAttribute('data-category-id');
				const storyContainer = this.slides[this.activeIndex].querySelector('.storyteller-story-container');
				await fetchPostsAndCreateStory(categoryId, storyContainer);
			},
		},
	});

	// Initialize the first category's inner Swiper
	const firstCategoryId = categories[0].id;
	const firstStoryContainer = categorySwiperContainer.querySelector('.storyteller-story-container');
	await fetchPostsAndCreateStory(firstCategoryId, firstStoryContainer);

	// Close the modal when the Esc key is pressed
	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') {
			modalContainer.remove();
		}
	});
}

// Attach click event listeners to the grid items
document.querySelectorAll('.storyteller-grid-item').forEach((item) => {
	item.addEventListener('click', async (e) => {
		e.preventDefault();
		const categoryId = e.currentTarget.getAttribute('data-category-id');
		await initCategorySwiper();
	});
});
