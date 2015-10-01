jQuery(function($){

	// check touch mode
	if ('ontouchstart' in document.documentElement)
	{
		$('html').addClass('touch');
	}
	else
	{
		$('html').addClass('no-touch');
	}

	// toggle local navigation
	$('#toggleNavigation').on('click', function(){
		$('#header > nav.lnb').toggleClass('on');
	});

	// navigation event for touch device
	var $lnb = $('html.touch #header > nav.lnb');
	var flag = false;
	$lnb.find('> ul.dep1 > li > a').on('touchend click', function(){
		var $li = $(this).parent();
		if (!flag) {
			flag = true;
			setTimeout(function(){ flag = false; }, 200);
			// ipad
			if ($(window).width() > 640)
			{
				if ($li.hasClass('on'))
				{
					$li.removeClass('on');
				}
				else
				{
					$li.parent().children().removeClass('on');
					$li.addClass('on');
				}
			}
		}
		return false;
	});

	// navigation focus event
	$('#header > nav.lnb > ul.dep1 > li')
		.on('focusin', function(){
			$(this).addClass('on');
		})
		.on('focusout', function(){
			$(this).removeClass('on');
		})
	;

	// change page event
	$(window).on("popstate", function(event) {
		var data = event.originalEvent.state;
		if (data)
		{
			switch(data.type)
			{
				// go index
				case 'index':
					try {
						if (view.active)
						{
							view.close(false);
						}
					} catch(e) {
						location.reload();
					}
					break;
				// go article
				case 'article':
					try {
						if (view)
						{
							$('#items').find('a[href="' + data.url + '"]').closest('div.item').addClass('view');
							view.open(data.url, false);
						}
					} catch(e) {
						location.reload();
					}
					break;
			}
		}
	});


	// navigation - active position
	$('#header li.active').closest('div').parent().addClass('active');


	// resize event
	$(window).on('resize', function(){
		if ($(window).width() < 640)
		{
			$('html').addClass('mini');
		}
		else
		{
			$('html').removeClass('mini');
		}
	});
	$(window).trigger('resize');


	try {
		// close view button event
		$('body').on('click', 'button.closeView', function(){
			view.close(true);
		});
	
		// prev view event
		$('body').on('click', 'button.prevView', function(){
			if (!$(this).hasClass('disabled'))
			{
				view.go($('#Article').attr('data-prev'));
			}
		});

		// next view event
		$('body').on('click', 'button.nextView', function(){
			if (!$(this).hasClass('disabled'))
			{
				view.go($('#Article').attr('data-next'));
			}
		});
	} catch(e) {}


	// Google Analytics
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	ga('create', 'UA-42563094-1', 'redgoose.me');
	ga('send', 'pageview');
});