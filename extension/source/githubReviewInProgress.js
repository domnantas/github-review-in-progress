import {isPR, utils} from 'github-url-detection';
import {io} from 'socket.io-client';
import optionsStorage from './optionsStorage.js';
// Import {fetchGithub} from './githubApi.js';

const {getRepositoryInfo, getUsername} = utils;

const {personalToken} = await optionsStorage.getAll();
const username = getUsername();

const socket = io('http://localhost:3000', {
	auth: {
		username,
	},
});

const init = async () => {
	if (isPR()) {
		if (!personalToken) {
			console.log('Github Review In Progress: Personal token not set');
			return;
		}

		const repositoryOwner = getRepositoryInfo().owner;
		const repositoryName = getRepositoryInfo().name;
		const prNumber = location.pathname.split('/')[4];
		const prPath = `${repositoryOwner}/${repositoryName}#${prNumber}`;

		socket.emit('join', prPath);
		console.log(`Joining ${prPath}`);

		socket.on('users', users => {
			for (const username of users) {
				const assigneeElement = document.querySelector(`[data-assignee-name="${username}"]`);
				const isStatusAlreadyShown = assigneeElement.querySelector('.github-review-in-progress');
				if (isStatusAlreadyShown) {
					return;
				}

				const dotElement = document.createElement('div');
				dotElement.classList.add('github-review-in-progress');
				assigneeElement.append(dotElement);
			}
		});

		// Leaving this comment here for future reference of Github GraphQL requests
		// Const {repository} = await fetchGithub(`
		// {
		// 	repository(owner: "${repositoryOwner}", name: "${repositoryName}") {
		// 		pullRequest(number: 1) {
		// 			author {
		// 				login
		// 			}
		// 		}
		// 	}
		// }`);

		// const isAuthor = repository.pullRequest.author.login === username;
	} else {
		console.log('exit');
	}
};

init();

document.addEventListener('pjax:end', () => {
	// Github uses pjax and acts sort of like SPA, pjax:end is fired on each navigation
	init();
});
