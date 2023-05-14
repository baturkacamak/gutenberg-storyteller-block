import '../common/style.css';
import {registerBlockType} from '@wordpress/blocks';
import {__} from '@wordpress/i18n';
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {PanelBody, SelectControl, DateTimePicker} from '@wordpress/components';
import {useState, useEffect} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

registerBlockType('create-block/gutenberg-storyteller-block', {
	apiVersion: 2,
	title: __('StoryTeller', 'storyteller-block'),
	description: __('A block to display posts from selected categories as Instagram-style stories.', 'storyteller-block'),
	icon: 'images-alt2',
	category: 'widgets',
	attributes: {
		categories: {
			type: 'array',
			default: [],
		},
		timeStart: {
			type: 'string',
			default: '',
		},
	},
	edit: (props) => {
		const {attributes, setAttributes} = props;
		const {categories, timeStart} = attributes;

		const blockProps = useBlockProps();

		// Fetch categories from the WordPress REST API
		const [categoryOptions, setCategoryOptions] = useState([]);
		useEffect(() => {
			apiFetch({path: '/wp/v2/categories'}).then((data) => {
				const options = data.map((category) => ({
					value: category.id,
					label: category.name,
				}));
				setCategoryOptions(options);
			});
		}, []);

		const [posts, setPosts] = useState([]);

		useEffect(() => {
			if (categories.length > 0) {
				Promise.all(
					categories.map((category) =>
						apiFetch({
							path: `/wp/v2/posts?categories=${category}&per_page=1&_embed`,
						})
					)
				).then((results) => {
					setPosts(results.flat());
				});
			} else {
				setPosts([]);
			}
		}, [categories]);

		// Add the following useEffect block
		useEffect(() => {
			if (!posts || posts.length === 0) {
				return;
			}

			const storyItems = document.querySelectorAll(".storyteller-grid-item");

			if (!storyItems || storyItems.length === 0) {
				return;
			}

			const story = new Story(storyItems);

			storyItems.forEach((item) => {
				item.addEventListener("click", () => {
					story.showNextStory();
				});
			});

			let touchStartX = null;
			const handleTouchStart = (event) => {
				touchStartX = event.touches[0].clientX;
			};

			const handleTouchMove = (event) => {
				if (!touchStartX) {
					return;
				}

				let touchEndX = event.touches[0].clientX;
				let diffX = touchStartX - touchEndX;

				if (Math.abs(diffX) > 50) { // Adjust the threshold value as needed
					if (diffX > 0) {
						story.showNextStory();
					} else {
						story.showPrevStory();
					}
					touchStartX = null;
				}
			};

			document.addEventListener("touchstart", handleTouchStart);
			document.addEventListener("touchmove", handleTouchMove);

			return () => {
				document.removeEventListener("touchstart", handleTouchStart);
				document.removeEventListener("touchmove", handleTouchMove);
			};
		}, [posts]);


		return (
			<div {...blockProps}>
				<InspectorControls>
					<PanelBody title="Story Settings" initialOpen={true}>
						<SelectControl
							multiple
							label="Select Categories"
							value={categories}
							options={categoryOptions}
							onChange={(selectedCategories) =>
								setAttributes({categories: selectedCategories})
							}
						/>
						<DateTimePicker
							currentDate={timeStart}
							onChange={(date) => setAttributes({timeStart: date})}
							is12Hour={true}
						/>
					</PanelBody>
				</InspectorControls>
				<div className="storyteller-block-editor">
					<div className="storyteller-grid flex space-x-6">
						{posts.map((post) => (
							<div key={post.id} className="storyteller-grid-item flex flex-col items-center space-y-1">
								<div
									className="relative bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-1 rounded-full">
								</div>
								<a href={post.link}
								   className="block bg-white p-1 rounded-full transform hover:-rotate-6">
									{post._embedded['wp:featuredmedia'] && (
										<img
											className="!h-24 w-24 rounded-full"
											src={post._embedded['wp:featuredmedia'][0].source_url}
											alt={post._embedded['wp:featuredmedia'][0].alt_text}
										/>
									)}
								</a>
							</div>
						))}
					</div>
					<p>Select categories and time range in the block settings.</p>
				</div>
			</div>
		);
	},
	save: () => {
		return null;
	},
});
