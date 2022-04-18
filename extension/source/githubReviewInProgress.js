import * as pageDetect from 'github-url-detection';
import optionsStorage from './optionsStorage.js';
import {fetchGithub} from './githubApi.js';

const init = async () => {
	const {personalToken} = await optionsStorage.getAll();

	if (!personalToken) {
		console.log('Github Review In Progress: Personal token not set');
		return;
	}

	if (pageDetect.isPR()) {
		const login = await fetchGithub('{ viewer { login } }');
		console.log(login);
	}
};

init();

document.addEventListener('pjax:end', () => {
	// Github uses pjax and acts sort of like SPA, pjax:end is fired on each navigation
	init();
});
