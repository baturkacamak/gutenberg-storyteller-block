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

export default Fetcher;
