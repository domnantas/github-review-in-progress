import * as pageDetect from 'github-url-detection';
import {io} from 'socket.io-client';
import optionsStorage from './optionsStorage.js';
import {fetchGithub} from './githubApi.js';

const init = async () => {
	const socket = io('http://localhost:3000');
	console.log(socket);

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
