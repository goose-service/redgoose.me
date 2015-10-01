var View = function(userData) {

	// private variables
	var self = this;
	var dom = {
		index : $('#Index')
		,items : $('#items')
		,view : $('#View')
		,bg : $('#View_bg')
		,title : $('head > title')
		,topNav : $('#topNav')
		,body : $('html, body')
	};
	var speed = 300;
	var $html = $('html');

	// public variables
	this.active = false;
	this.path = null;


	/*----------------------------------------*\
	 * PRIVATE METHOD
	\*----------------------------------------*/

	/**
	 * init
	 */
	var init = function() {}


	/**
	 * manage direction buttons
	 * 
	 * @Param {DOM} $article
	 * @Return void
	 */
	var directionButtons = function($article)
	{
		if ($article.attr('data-prev'))
		{
			$('button.prevView').removeClass('disabled');
		}
		else
		{
			$('button.prevView').addClass('disabled');
		}
		if ($article.attr('data-next'))
		{
			$('button.nextView').removeClass('disabled');
		}
		else
		{
			$('button.nextView').addClass('disabled');
		}
	};

	/**
	 * update url
	 * 
	 * @Param {Boolean} sw : write history
	 * @Param {String} title
	 * @Param {String} url
	 * @Return void
	 */
	var updateURL = function(sw, title, url)
	{
		self.path = window.location.pathname + window.location.search;
		if (sw && window.history.pushState)
		{
			dom.title.text(title);
			window.history.pushState({
				type : 'article'
				,url : url
			}, title, url);
		}
	};


	/*----------------------------------------*\
	 * PUBLIC METHOD
	\*----------------------------------------*/
	
	/**
	 * open view
	 * 
	 * @Param {String} url
	 * @Param {Boolean} sw : write history
	 * @Return void
	 */
	this.open = function(url, sw)
	{
		self.active = true;
		$html.removeClass('scroll');
		dom.view.show();
		dom.bg.fadeIn(speed, function(){
			if (masonry)
			{
				masonry.destroy();
				masonry = null;
			}
			dom.index.hide();
			dom.view.load(url + ' #Article', function(){
				$('html').addClass('mode-view');
				$('#topNav').addClass('on');

				updateURL(sw, $(this).children().attr('data-title'), url);
				directionButtons($(this).children());
			});
		});

		// keyboard event
		$html.on('keyup.gooseView', function(e){
			var $article = dom.view.children();
			switch(e.keyCode)
			{
				case 27:
					// esc
					self.close();
					break;
				case 37:
					// left
					if ($article.attr('data-prev'))
					{
						self.go($article.attr('data-prev'));
					}
					break;
				case 39:
					// right
					if ($article.attr('data-next'))
					{
						self.go($article.attr('data-next'));
					}
					break;
			}
		});
	};

	/**
	 * close view
	 * 
	 * @Param {Boolean} sw
	 * @Return void
	 */
	this.close = function(sw)
	{
		self.active = false;
		$('button.closeView').off('click');
		$('html').off('keyup.gooseView').addClass('scroll');
		$('#topNav').removeClass('on');
		dom.index.show();
		dom.items.masonry(masonryOptions);
		window.masonry = dom.items.data('masonry');
		masonry.on('layoutComplete', window.masonryLayoutComplete);
		dom.bg.fadeOut(speed);
		dom.view.fadeOut(speed, function(){
			$('html').removeClass('mode-view');
			$(this).empty();
			var $viewItem = dom.items.children('div.view');
			var targetTop = $viewItem.offset().top - userData.paddingTop;
			if (targetTop > 220)
			{
				dom.body.scrollTop(targetTop);
			}
			$viewItem.removeClass('view');
		});
		if (sw && window.history.pushState)
		{
			dom.title.text(userData.title);
			window.history.pushState({
				type : 'index'
				,url : self.path
			}, userData.title, self.path);
		}
		self.path = null;
	};

	/**
	 * go view
	 * 
	 * @Param {String} url : url address
	 * @Return void
	 */
	this.go = function(url)
	{
		dom.view.load(url + ' #Article', function(){
			updateURL(true, $(this).children().attr('data-title'), url);
			directionButtons($(this).children());
		});
	};

	// action
	init();
};