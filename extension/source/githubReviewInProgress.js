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

		const username = getUsername();
		const repositoryOwner = getRepositoryInfo().owner;
		const repositoryName = getRepositoryInfo().name;
		const prNumber = location.pathname.split('/')[4];
		const prPath = `${repositoryOwner}/${repositoryName}#${prNumber}`;

		const socket = io('http://localhost:3000', {
			auth: {
				username,
			},
		});

		socket.emit('join', prPath);
		console.log(`Joining ${prPath}`);

		socket.on('users', users => {
			for (const username of users) {
				const assigneeElement = document.querySelector(`[data-assignee-name="${username}"]`);
				assigneeElement.nextElementSibling.classList.add('github-review-in-progress');
			}
		});

		const {repository} = await fetchGithub(`
		{
			repository(owner: "${repositoryOwner}", name: "${repositoryName}") {
				pullRequest(number: 1) {
					author {
						login
					}
				}
			}
		}`);

		const isAuthor = repository.pullRequest.author.login === username;
		console.log(isAuthor);
	}
};

init();

document.addEventListener('pjax:end', () => {
	// Github uses pjax and acts sort of like SPA, pjax:end is fired on each navigation
	init();
});
