/**
 * check i18n file modification and reread if need
 * @author sarkiroka on 2018.04.30.
 */
const debug = require('debug')('pug-i18n-postparse:try-to-re-read-i18n-json');
const fs = require('fs');

let thePathOfI18nJson = null;
let lastMTime = 0;

function tryToReReadI18nJson() {
	if (debug.enabled) {
		debug('check the i18n json file changes.');
	}
	tryToReReadI18nJson.lastReadTime = Date.now();
	fs.stat(thePathOfI18nJson, function (statError, stat) {
		if (statError) {
			console.error('cannot stat the i18n json file', {path: thePathOfI18nJson, err: statError});
			return;
		}
		if (lastMTime < stat.mtime) {
			if (debug.enabled) {
				debug('the file was changed, try to re-read it');
			}
			fs.readFile(thePathOfI18nJson, 'utf-8', function (readError, content) {
				if (readError) {
					console.error('cannot read the i18n json file', {path: thePathOfI18nJson, err: readError});
					return;
				}
				try {
					tryToReReadI18nJson.i18n = JSON.parse(content);
					lastMTime = stat.mtime;
					if (debug.enabled) {
						debug(`the language file successfully re-readed from "${thePathOfI18nJson}"`);
					}
				} catch (e) {
					console.error('cannot parse the i18n json file', {path: thePathOfI18nJson, err: e});
				}
			});
		} else {
			if (debug.enabled) {
				debug('the file was not changed, not need to re-read');
			}
		}
	});
}

tryToReReadI18nJson.i18n = {};
tryToReReadI18nJson.lastReadTime = 0;

tryToReReadI18nJson.init = function (filePath) {
	thePathOfI18nJson = filePath;
};

module.exports = tryToReReadI18nJson;
