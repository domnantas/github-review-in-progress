// Don't forget to import this wherever you use it
import browser from 'webextension-polyfill';

import optionsStorage from './optionsStorage.js';

async function init() {
	await optionsStorage.syncForm('#options-form');
}

init();
