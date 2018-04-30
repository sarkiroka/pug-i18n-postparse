/**
 * the post parse implementation
 * @author sarkiroka on 2018.04.30.
 */
const debug = require('debug')('pug-i18n-postparse:post-parse');
const i18n = require('./i18n');
const walk = require('pug-walk');

let defaultLanguage;

const isTranslateableButton = attribute => {
	return attribute.name == 'type' &&
		(attribute.val == 'button' || attribute.val == '"button"' || attribute.val == '\'button\'' ||
			attribute.val == 'submit' || attribute.val == '"submit"' || attribute.val == '\'submit\'' ||
			attribute.val == 'cancel' || attribute.val == '"cancel"' || attribute.val == '\'cancel\'');
};

const notAScript = ast => !ast.nodes || !ast.nodes[0] || ast.nodes[0].name != 'script';

module.exports = function postParse(ast) {
	let language;
	if (this.languageStore) {
		language = this.languageStore.language;
	}
	if (!language) {
		language = defaultLanguage;
	}
	if (debug.enabled) {
		debug('start post parsing', {language});
	}
	return walk(ast, (node) => {
		let isText = node.type == 'Text';
		let needTextTranslation = isText && notAScript(ast);
		if (needTextTranslation) {
			node.val = i18n.t(node.val, language);
		} else {
			let isInput = node.type == 'Tag' && (node.name == 'input' || node.name == 'textarea') && node.attrs && node.attrs.length;
			let isLink = node.type == 'Tag' && node.name == 'a' && node.attrs && node.attrs.length;
			if (isInput) {
				for (let i = 0; i < node.attrs.length; i++) {
					let attr = node.attrs[i];
					if (attr.name == 'placeholder' || attr.name == 'title') {
						attr.val = i18n.t(attr.val, language);
					} else if (attr.name == 'value') { // value attibutumot is leforditjuk ha az gombon van
						var hasTypeButtonAttribute = node.attrs.find(isTranslateableButton);
						if (hasTypeButtonAttribute) {
							attr.val = i18n.t(attr.val, language);
						}
					}
				}
			} else if (isLink) {
				for (let i = 0; i < node.attrs.length; i++) {
					let attr = node.attrs[i];
					if (attr.name == 'title') {
						attr.val = i18n.t(attr.val, language);
					}
				}
			}
		}
	});
};

module.exports.setDefaultLanguage = function (language) {
	defaultLanguage = language;
	if (debug.enabled) {
		debug('the default language setted to "%s"', defaultLanguage);
	}
};
