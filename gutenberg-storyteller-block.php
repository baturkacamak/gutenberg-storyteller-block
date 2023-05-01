<?php
/**
 * Plugin Name:       Gutenberg Storyteller Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gutenberg-storyteller-block
 *
 * @package           create-block
 */

function post_already_included($post_id, $posts_array)
{
	foreach ($posts_array as $post) {
		if ($post->ID === $post_id) {
			return true;
		}
	}

	return false;
}

function storyteller_render_block($attributes)
{
	$categories = $attributes['categories'];
	$time_start = $attributes['timeStart'];

	// Initialize an empty array to store the posts
	$posts = [];

	// Fetch a single post from each selected category
	foreach ($categories as $category) {
		$posts_to_exclude = array_map(function ($post) {
			return $post->ID;
		}, $posts);

		$category_posts = get_posts([
				'category__in'   => [$category],
				'date_query'     => [
						[
								'column' => 'post_date',
								'after'  => $time_start,
						],
				],
				'post__not_in'   => $posts_to_exclude,
				'posts_per_page' => 1,
				'orderby'        => 'post_date',
				'order'          => 'ASC',
		]);

		// Add the post to the $posts array if a post is found
		if (!empty($category_posts)) {
			$posts[] = $category_posts[0];
		}
	}

	// Output the HTML for the block
	ob_start();
	?>
	<div class="storyteller-block">
		<div class="storyteller-grid flex space-x-6">
			<?php foreach ($posts as $post) : ?>
				<?php $thumbnail = get_the_post_thumbnail_url($post->ID, 'medium_large'); ?>
				<div class='storyteller-grid-item flex flex-col items-center space-y-1'>
					<div class='relative bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-1 rounded-full'>
					</div>
					<a href="<?php echo get_permalink($post->ID); ?>"
					   class='block bg-white p-1 rounded-full transform hover:-rotate-6'>
						<img
								class='!h-24 w-24 rounded-full'
								src="<?php echo esc_attr($thumbnail); ?>"
								alt="<?php echo get_post_meta($post->ID, ' _wp_attachment_image_alt', true); ?>"
						/>
					</a>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_gutenberg_storyteller_block_block_init()
{
	register_block_type(__DIR__ . '/build', [
			'render_callback' => 'storyteller_render_block',
	]);
	register_block_type('create-block/gutenberg-storyteller-block', [
			'render_callback' => 'storyteller_render_block',
	]);
}

add_action('init', 'create_block_gutenberg_storyteller_block_block_init');

function storyteller_enqueue_block_assets()
{
	wp_enqueue_style(
			'storyteller-block-style',
			plugins_url('build/output.css', __FILE__),
			[],
			filemtime(plugin_dir_path(__FILE__) . 'build/output.css')
	);
}

add_action('enqueue_block_assets', 'storyteller_enqueue_block_assets');
add_action('wp_enqueue_scripts', 'storyteller_enqueue_block_assets');
