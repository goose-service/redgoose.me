function Index(userData)
{
	// set variables
	var self = this;
	var $$ = {
		items : $('#items')
		,body : $('html, body')
		,category : $('#categoryList')
		,loading : null
	};


	// item size to class
	var itemSizeToClass = function(w, h)
	{
		var str = '';
		str += (w == 470) ? ' wx2' : '';
		str += (h == 470) ? ' hx2' : '';
		return str;
	};

	// update url
	this.updateUrl = function(url)
	{
		var params = null;
		var urlArray = url.split('?');
		var str = '';

		if (urlArray[1])
		{
			params = JSON.parse('{"' + decodeURI(urlArray[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
		}
		else
		{
			params = new Object();
		}

		params.page = (params.page) ? parseInt(params.page) + 1 : 2;

		for (var key in params)
		{
			if (str != "")
			{
				str += "&";
			}
			str += key + "=" + params[key];
		}
		params = str;

		return urlArray[0] + '?' + params;
	};

	// load items
	this.loadItems = function(url, func)
	{
		$.ajax({
			type : 'get'
			,url : url
			,dataType : 'json'
			,timeout : 3000
			,error : function(request, status, error)
			{
				log('error message');
				log(error);
			}
			,success : function(res, status, req)
			{
				var markup = '';
				var $newItems = null;
				var sizeClass = null;
				for (var i=0; i<res.length; i++)
				{
					sizeClass = itemSizeToClass(res[i].width, res[i].height);
					if (res[i].more)
					{
						markup += '<a href="#" class="item more" title="more item"><span><em><i>More item</i></em></span></a>';
					}
					else
					{
						markup += '<div class="item' + sizeClass + '"><a href="' + res[i].url + '"><img src="' + res[i].img + '" alt="' + res[i].title + '" /></a></div>';
					}
				}

				$newItems = $(markup);

				// click item
				$newItems.not('div.more').children('a').on('click', function(e){
					if (window.history.pushState)
					{
						window.history.pushState({
							type : 'index'
							,url : window.location.pathname + window.location.search
						}, userData.title, window.location.pathname + window.location.search);
					}
					$(this).closest('div.item').addClass('view');
					view.open($(this).attr('href'), true);
					return false;
				});

				// more event
				$newItems.filter('.more').on('click', function(e){
					var $more = $(this);
					userData.loadItemsUrl = self.updateUrl(userData.loadItemsUrl);

					var url = self.updateUrl(window.location.pathname + location.search);
					if (window.history.pushState)
					{
						window.history.pushState({}, userData.title, url);
					}

					window.gotoTop = $more.offset().top;

					$more.off('click');
					$more.addClass('loading');
					$$.loading = $more;

					self.loadItems(userData.loadItemsUrl, function(){
						$more.next().find('a').focus();
					});

					return false;
				});

				$newItems.imagesLoaded(function(){
					if ($$.loading)
					{
						masonry.remove($$.loading);
						$$.loading = null;
					}
					if (masonry)
					{
						$$.items.masonry()
							.append($newItems)
							.masonry('appended', $newItems)
							.masonry('layout')
						;
					}
					else
					{
						$$.items
							.append($newItems)
							.masonry(masonryOptions)
						;
						masonry = $$.items.data('masonry');
						masonry.on('layoutComplete', window.masonryLayoutComplete);
					}
					if (func)
					{
						func();
					}
				});
			}
		});
	};


	/* E V E N T S */
	// layout complete
	window.masonryLayoutComplete = function()
	{
		if (window.gotoTop)
		{
			window.gotoTop = window.gotoTop - userData.paddingTop;
			$$.body.animate({scrollTop:window.gotoTop}, 400, 'swing');
			window.gotoTop = null;
		}
	};


	/* A C T I O N */

	$('body').append('<div id="View_bg"></div><section id="View"></section>');

	window.view = new View(userData);

	// set masonry options
	window.masonryOptions = {
		itemSelector: '.item'
		,columnWidth: '.grid-sizer'
		//,isAnimated: true
		//,transitionDuration : '.3s'
	};
	window.masonry = null;

	// toggle category list
	$('#toggleCategory').on('click', function(){
		$(this).toggleClass('on');
		$$.category.children('ul').toggleClass('on');
	});

	// load items
	this.loadItems(userData.loadItemsUrl);

	if (window.history.pushState)
	{
		var path = window.location.pathname + window.location.search;
		window.history.pushState({type:'index'}, userData.title, path);
	}
}