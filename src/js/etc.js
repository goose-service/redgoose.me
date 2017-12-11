
// default options
export const defaultOptions = {
	root: '',
	gooseRoot: '',
	debug: false,
};


/**
 * init google analytics
 *
 * @param {Boolean} sw
 */
export function initGoogleAnalytics(sw)
{
	if (!sw) return null;

	// Google Analytics
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-42563094-1', 'redgoose.me');
	ga('send', 'pageview');
}
