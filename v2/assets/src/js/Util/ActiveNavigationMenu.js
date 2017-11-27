function ActiveNavigationMenu($nav) {

	this.$navigation = $nav;

	this.init = () => {
		this.$navigation.find('.dep-2 li.active').parent().closest('li').addClass('active');
	}

}

export default ActiveNavigationMenu;