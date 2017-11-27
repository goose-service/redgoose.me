const template = '<div class="popup-loading">' +
	'<div class="wrap">' +
	'<div class="sk-folding-cube">' +
	'<div class="sk-cube1 sk-cube"></div>' +
	'<div class="sk-cube2 sk-cube"></div>' +
	'<div class="sk-cube4 sk-cube"></div>' +
	'<div class="sk-cube3 sk-cube"></div>' +
	'</div>' +
	'</div>' +
	'</div>';

function Loading() {

	this.$el = $(template);

	this.on = () => {
		$('body').append(this.$el);
	};

	this.off = () => {
		this.$el.remove();
	}

}


export default Loading;