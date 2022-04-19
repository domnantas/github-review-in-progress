import {isPR, utils} from 'github-url-detection';
import {io} from 'socket.io-client';
import optionsStorage from './optionsStorage.js';
import {fetchGithub} from './githubApi.js';

const {getRepositoryInfo, getUsername} = utils;

const init = async () => {
	if (isPR()) {
		const {personalToken} = await optionsStorage.getAll();

		if (!personalToken) {
			console.log('Github Review In Progress: Personal token not set');
			return;
		}

		const socket = io('http://localhost:3000');

		const prNumber = location.pathname.split('/')[4];

		socket.on('view list', list => {
			const prViewList = list.filter(view => view.prNumber === prNumber);
			for (const view of prViewList) {
				const assigneeElement = document.querySelector(`[data-assignee-name="${view.username}"]`);
				assigneeElement.nextElementSibling.classList.add('github-review-in-progress');
			}
		});

		const {repository} = await fetchGithub(`
		{
			repository(owner: "${getRepositoryInfo().owner}", name: "${getRepositoryInfo().name}") {
				pullRequest(number: 1) {
					author {
						login
					}
				}
			}
		}`);

		const username = getUsername();
		const isAuthor = repository.pullRequest.author.login === username;

		if (!isAuthor) {
			socket.emit('view', {username, prNumber});
		}

		console.log(isAuthor);
	}
};

init();

document.addEventListener('pjax:end', () => {
	// Github uses pjax and acts sort of like SPA, pjax:end is fired on each navigation
	init();
});
