// Import the necessary classes
import Fetcher from './Fetcher';
import SliderFactory from './SliderFactory';
import UIHandler from './UIHandler';
import DomHelper from './DomHelper';
import StoryTellerFacade from './StoryTellerFacade'; // Import the StoryTellerFacade class
// Import the other classes if necessary (StoryManager and EventController)

// Instantiate the required classes
const fetcher = new Fetcher();
const sliderFactory = new SliderFactory();
const uiHandler = new UIHandler();
const domHelper = new DomHelper();

// Instantiate the StoryTellerFacade class
const storyTellerFacade = new StoryTellerFacade(fetcher, sliderFactory, uiHandler, domHelper);

// Attach click event listeners to the grid items
document.querySelectorAll('.storyteller-grid-item').forEach((item, index) => {
	item.addEventListener('click', async (e) => {
		e.preventDefault();
		await storyTellerFacade.initCategorySwiper(index);
	});
});
