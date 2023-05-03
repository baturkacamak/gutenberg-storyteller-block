// Function to fetch posts from a category and create the story slider
async function fetchPostsAndCreateStory(categoryId) {
	const response = await fetch('/wp-json/wp/v2/posts?categories=' + categoryId + '&_embed');
	const posts = await response.json();

	// Create the Instagram story container and slider
	const storyContainer = document.createElement('div');
	storyContainer.classList.add('storyteller-story-container');
	storyContainer.innerHTML = `
    <div class="swiper-container fixed top-0 left-0 max-h-screen max-w-screen">
      <div class="swiper-wrapper">
        ${posts
		.map(
			(post) => `
          <div class="swiper-slide">
            <div class="storyteller-story-item">
             	<img class="w-screen" src="${post._embedded['wp:featuredmedia'][0].source_url}" alt="${post.title.rendered}">
            </div>
          </div>`
		)
		.join('')}
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
  `;

	// Append the story container to the body
	document.body.appendChild(storyContainer);

	// Initialize the Swiper.js slider
	const swiper = new Swiper('.swiper-container', {
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

	console.log(swiper)
}

// Attach click event listeners to the grid items
document.querySelectorAll('.storyteller-grid-item').forEach((item) => {
	item.addEventListener('click', (e) => {
		e.preventDefault();
		const categoryId = e.currentTarget.getAttribute('data-category-id');
		fetchPostsAndCreateStory(categoryId).then(r => console.log(r));
	});
});
