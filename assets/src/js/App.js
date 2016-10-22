import Index from './Index';
import Mobile from './Mobile';
import View from './View';
import ActiveNavigationMenu from './Util/ActiveNavigationMenu';


// init redgoose state
window.redgooseState = {};


// set elements
const $articleIndex = $('#articleIndex');
const $moreItemArea = $('#moreItem');
const $navigation = $('#navigation');
const $toggleCategory = $('#toggleCategory');
const $articleView = $('#articleView');


/**
 * APP
 *
 * @Param {Object} userData
 */
window.APP = function(userData) {

	window.redgooseState.root = userData.root || '';
	window.redgooseState.gooseRoot = userData.gooseRoot || '';

	this.index = (options) => {

		// init instance objects
		const index = new Index();
		const mobile = new Mobile();

		// init toggle category
		mobile.toggleCategory( $toggleCategory );

		// init index
		index.init({
			_nest : options._nest,
			_category : options._category,
			$articleIndex : $articleIndex,
			$moreItemArea : $moreItemArea,
		});

		// init masonry
		index.initMasonry( $articleIndex.get(0) );

		// init load item
		index.initLoadItem();

	};

	this.view = () => {
		const view = new View();

		// init page
		view.initPage( $articleView );
	}
};


// init mobile
let mobile = new Mobile();
mobile.init();


// active navigation menu

if ($navigation.length)
{
	let activeNavigationMenu = new ActiveNavigationMenu( $navigation );
	activeNavigationMenu.init();
}