import optionsStorage from './optionsStorage.js';

export const fetchGithub = async query => {
	const githubGraphqlUrl = 'https://api.github.com/graphql';
	const {personalToken} = await optionsStorage.getAll();

	const response = await fetch(githubGraphqlUrl, {
		method: 'POST',
		headers: {
			Authorization: `bearer ${personalToken}`,
		},
		body: JSON.stringify({query}),
	});

	const {errors = [], data} = await response.json();

	if (errors.length > 0) {
		throw new Error(`Github GraphQL error: ${errors.map(error => error.message).join(', ')}`);
	}

	if (response.ok) {
		return data;
	}
};
