/**
 * create pug i18n postparse plugin
 * @author sarkiroka on 2018.04.22.
 */
const debug = require('debug')('pug-i18n-postparse:index');
const i18n = require('./i18n');
const postParse = require('./post-parse');

module.exports = function () {

};

function createPostParseExpress(res) {
	if (debug.enabled) {
		debug('create express binding');
	}
	return postParse.bind({languageStore: res.locals});
}

module.exports.express = function (defaultLanguageParam, pathOfLanguageFile) {
	function i18nMiddleware(req, res, next) {
		if (debug.enabled) {
			debug('run in express middleware');
		}
		if (!res.locals) {
			res.locals = {};
		}
		if (!res.locals.plugins) {
			res.locals.plugins = [];
		}
		if (typeof res.locals.plugins.push != 'function') {
			console.error('res.locals.plugins is not an array, cannot continue internationalization...');
		} else {
			res.locals.plugins.push({postParse: createPostParseExpress(res)});
		}
		next();
	}

	postParse.setDefaultLanguage(defaultLanguageParam);
	if (typeof pathOfLanguageFile == 'string') { // path
		i18n.init(pathOfLanguageFile);
	} else if (typeof pathOfLanguageFile == 'function') { // translate function
		i18n.t = pathOfLanguageFile;
	} else {
		throw new Error('Must specify the path of language file');
	}
	return i18nMiddleware;
};
