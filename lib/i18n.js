/**
 * the default implementation of i18n translate function
 * @author sarkiroka on 2018.04.30.
 */
const debug = require('debug')('pug-i18n-postparse:i18n');
const tryToReReadI18nJson = require('./try-to-re-read-i18n-json');

const beforeRegex = /^ /;
const afterRegex = / $/;
const quoteRegex = /^"(.+)"$/;
const aposRegex = /^'(.+)'$/;
const quoteOrAposRegex = /^(?:"|')(.+)(?:"|')$/;

module.exports.init = function (pathOfI18nJson) {
	tryToReReadI18nJson.init(pathOfI18nJson);
	tryToReReadI18nJson();
};

module.exports.t = function (text, language) {
	if (tryToReReadI18nJson.lastReadTime + 30000 < Date.now()) {
		tryToReReadI18nJson();
	}
	let trimmedText = text.trim();
	let retValue = text;
	let hasNormalTranslation = tryToReReadI18nJson.i18n && tryToReReadI18nJson.i18n[language] && tryToReReadI18nJson.i18n[language][trimmedText];
	let hasQuotedTranslation = false;
	let hasApos = false;
	let hasQuote = false;
	if (!hasNormalTranslation) {
		hasApos = aposRegex.test(trimmedText);
		hasQuote = quoteRegex.test(trimmedText);
		if (hasApos || hasQuote) {
			trimmedText = quoteOrAposRegex.exec(trimmedText)[1];
			hasQuotedTranslation = tryToReReadI18nJson.i18n && tryToReReadI18nJson.i18n[language] && tryToReReadI18nJson.i18n[language][trimmedText];
		}
	}
	if (hasNormalTranslation || hasQuotedTranslation) {
		retValue = tryToReReadI18nJson.i18n[language][trimmedText];
	} else {
		if (trimmedText && debug.enabled) { // because spaces
			debug(`there is no translation for this text "${text}" language: ${language} %o`, {
				hasNormalTranslation,
				hasQuotedTranslation,
				languages: Object.keys(tryToReReadI18nJson.i18n)
			});
		}
	}
	if (hasQuotedTranslation) {
		if (hasApos) {
			retValue = `'${retValue}'`;
		}
		if (hasQuote) {
			retValue = `"${retValue}"`;
		}
	}
	if (beforeRegex.test(text)) { // ha valahol számítana, hogy mennyi szóköz van elől vagy hátul, akkor azt itt ki kell javitani
		retValue = ' ' + retValue;
	}
	if (afterRegex.test(text)) {
		retValue += ' ';
	}
	quoteOrAposRegex.lastIndex = 0;
	beforeRegex.lastIndex = 0;
	afterRegex.lastIndex = 0;
	quoteRegex.lastIndex = 0;
	aposRegex.lastIndex = 0;
	return retValue;
};
