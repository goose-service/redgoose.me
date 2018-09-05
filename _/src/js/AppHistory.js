import $ from 'jQuery';


export default function AppHistory(parent) {

	const self = this;
	const $title = $('head > title');

	/**
	 * check support
	 *
	 * @Return {Boolean}
	 */
	function support()
	{
		return !!history.pushState;
	}

	/**
	 * Push state
	 *
	 * @Param {Object} env
	 * @Param {String} title
	 * @Param {String} url
	 */
	this.push = function(env, title, url)
	{
		if (!support()) return;
		if (!url) return;

		// change title
		if (title)
		{
			$title.text(title);
		}

		history.pushState(
			env || null,
			title || url,
			url
		);
	};

	/**
	 * Replace state
	 *
	 * @Param {Object} env
	 * @Param {String} title
	 * @Param {String} url
	 */
	this.replace = function(env, title, url)
	{
		if (!support()) return;
		if (!url) return;

		// change title
		if (title)
		{
			$title.text(title);
		}

		history.replaceState(
			env || null,
			title || url,
			url
		);
	};

	/**
	 * initial history pop event
	 */
	this.initPopEvent = function()
	{
		function onPopState(e)
		{
			const state = e.state;

			if (state && state.type)
			{
				switch (state.type)
				{
					case 'index':
						// 여기로 진입하는 조건은 목록에서 페이지가 변해서 `e.state`에 값이 들어갔기 때문에 여기에 걸리는 것이다.
						// 목록으로 돌아갈때 두가지 방식으로 돌아간다.
						// 첫번째는 `X`버튼을 눌러서 팝업을 닫고 주소만 바꾸은 방식인데 이미 팝업이 닫혀있는 상태이기 때문에 이벤트를 그대로 막아주면 된다.
						// 두번째는 뒤로가기인데 그냥두면 그대로 있기 때문에 팝업을 직접 닫아줘야한다.

						if (parent.mode === 'article')
						{
							if (parent.article.srl)
							{
								// 팝업이 띄어진 상태라면 팝업을 닫아준다.
								parent.article.close();
								return false;
							}
							if (!parent.index)
							{
								// 팝업이 아닌 `article`페이지에서 목록으로 넘어갔을 경우
								location.reload();
								return false;
							}
						}
						return false;

					case 'article':
						if (parent.mode === 'index' && state.srl)
						{
							// 목록인 상태에서 실행된다면 `article` 열기
							parent.article.open(state.srl);
							return false;
						}

						if (parent.mode === 'article' && (parent.article.srl !== state.srl))
						{
							// `article`모드이며 srl 값이 서로 다를때 `article.go()` 실행
							parent.article.go(state.srl);
							return false;
						}
						break;

					default:

						if (parent.mode === 'article' && parent.$popup)
						{
							parent.article.close();
							return false;
						}

						location.reload();
						return false;
						break;
				}
			}
			else
			{
				if (parent.mode === 'article' && parent.$popup)
				{
					// `article`상태이고 팝업이 띄어진 상태라면 팝업 닫기
					parent.article.close();
					return false;
				}
				else if (parent.mode === 'index' && parent.$popup)
				{
					return false;
				}
			}

			// 아무것도 해당되지 않으면 새로고침하기
			location.reload();
			return false;
		}

		if (!support()) return;

		window.removeEventListener('popstate', onPopState);
		window.addEventListener('popstate', onPopState);
	}
}