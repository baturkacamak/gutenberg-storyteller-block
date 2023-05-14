/**
 * @class DomHelper
 * @desc A class for providing a simplified and consistent interface for manipulating the DOM
 */
export default class DomHelper {
	/**
	 * @function querySelector
	 * @desc Wrapper function for `document.querySelector`
	 * @param {string} selector - The CSS selector to query
	 * @param {HTMLElement} [context=document] - The context element to search within
	 * @returns {HTMLElement} - The first element matching the selector
	 */
	querySelector(selector, context = document) {
		return context.querySelector(selector);
	}

	/**
	 * @function querySelectorAll
	 * @desc Wrapper function for `document.querySelectorAll`
	 * @param {string} selector - The CSS selector to query
	 * @param {HTMLElement} [context=document] - The context element to search within
	 * @returns {NodeList} - A list of elements matching the selector
	 */
	querySelectorAll(selector, context = document) {
		return context.querySelectorAll(selector);
	}

	/**
	 * @function createElement
	 * @desc Wrapper function for `document.createElement`
	 * @param {string} tagName - The name of the element to create
	 * @returns {HTMLElement} - The created element
	 */
	createElement(tagName) {
		return document.createElement(tagName);
	}

	/**
	 * @function addClass
	 * @desc Adds one or more classes to an element
	 * @param {HTMLElement} element - The element to add the classes to
	 * @param {...string} classNames - The classes to add
	 */
	addClass(element, ...classNames) {
		element.classList.add(...classNames);
	}

	/**
	 * @function removeClass
	 * @desc Removes a class from an element
	 * @param {HTMLElement} element - The element to remove the class from
	 * @param {string} className - The class to remove
	 */
	removeClass(element, className) {
		element.classList.remove(className);
	}

	/**
	 * @function hasClass
	 * @desc Check if an element has a class
	 * @param {HTMLElement} element - The element to check
	 * @param {string} className - The class to check for
	 * @returns {boolean} - Whether the element has the class or not
	 */
	hasClass(element, className) {
		return element.classList.contains(className);
	}

	/**
	 * @function toggleClass
	 * @desc Toggles a class on an element
	 * @param {HTMLElement} element - The element to toggle the class on
	 * @param {string} className - The class to toggle
	 */
	toggleClass(element, className) {
		element.classList.toggle(className);
	}

	/**
	 * @function appendChild
	 * @desc Wrapper function for `HTMLElement.appendChild`
	 * @param {HTMLElement} parent - The parent element
	 * @param {HTMLElement} child - The child element to append
	 */
	appendChild(parent, child) {
		parent.appendChild(child);
	}

	/**
	 * @function removeChild
	 * @desc Wrapper function for `HTMLElement.removeChild`
	 * @param {HTMLElement} parent - The parent element
	 * @param {HTMLElement} child - The child element to remove
	 */
	removeChild(parent, child) {
		parent.removeChild(child);
	}

	/**
	 * @function addEventListener
	 * @desc Wrapper function for `HTMLElement.addEventListener`
	 * @param {HTMLElement} element - The element to add the event listener to
	 * @param {string} event - The event to listen for
	 * @param {function} callback - The function to call when the event is triggered
	 */
	addEventListener(element, event, callback) {
		element.addEventListener(event, callback);
	}
}
