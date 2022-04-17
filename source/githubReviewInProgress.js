import optionsStorage from './optionsStorage.js';

async function init() {
	const {personalToken} = await optionsStorage.getAll();

	const githubGraphqlUrl = 'https://api.github.com/graphql';

	fetch(githubGraphqlUrl, {
		method: 'POST',
		headers: {
			Authorization: `bearer ${personalToken}`,
		},
		body: JSON.stringify({
			query: `
				query {
					viewer {
						login
					}
				}
			`,
		}),
	})
		.then(response => response.json())
		.then(result => console.log(result));
}

init();
