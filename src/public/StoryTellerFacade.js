import StoryManager from "./StoryManager";
import EventController from "./EventController";

class StoryTellerFacade {
	constructor(fetcher, sliderFactory, uiHandler, domHelper) {
		this.fetcher = fetcher;
		this.sliderFactory = sliderFactory;
		this.uiHandler = uiHandler;
		this.domHelper = domHelper;
		this.storyManager = new StoryManager(fetcher, uiHandler, domHelper, sliderFactory);
		this.eventController = new EventController(this.storyManager, domHelper);
	}

	async initCategorySwiper(initialIndex = 0) {
		const categoryIds = Array.from(this.domHelper.querySelectorAll('[data-category-id]')).map((el) => el.dataset.categoryId);
		const categories = await this.fetcher.fetchCategories(categoryIds);
		const modalContainer = this.uiHandler.createModalContainer();
		const swiperContainer = this.uiHandler.createCategorySwiperContainer(modalContainer, categories);
		const eventListeners = this.eventController.getCategorySwiperEventListeners(initialIndex, modalContainer, categories, swiperContainer);
		const categorySwiper = this.sliderFactory.createCategorySwiper(swiperContainer, initialIndex, eventListeners);

		// Add modal close logic on Escape key press
		this.uiHandler.addModalCloseListener(modalContainer);
	}
}

export default StoryTellerFacade;
