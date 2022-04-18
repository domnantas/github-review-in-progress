import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		personalToken: '',
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});
