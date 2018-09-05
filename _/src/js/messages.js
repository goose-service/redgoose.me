const messages = {

	en: {
		msg_notFound: `Not found {0}`,
		msg_errorIndexMode: `It is not currently in 'index' mode.`,
		msg_errorArticleMode: `It is not currently in 'article' mode.`,
		msg_notAvailablePopupMode: `Not available in pop-up mode.`,
	},

	ko: {
		msg_notFound: `{0} 값이 없습니다.`,
		msg_errorIndexMode: `지금은 'index'모드가 아닙니다.`,
		msg_errorArticleMode: `지금은 'article'모드가 아닙니다.`,
		msg_notAvailablePopupMode: `팝업모드에서는 사용할 수 없습니다.`,
	},

};


export default messages[navigator.language] || messages.en;