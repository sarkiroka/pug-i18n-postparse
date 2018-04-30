/**
 * an express example
 * @author sarkiroka on 2018.04.22.
 */
function myI18nImplementation(text /* , language */) {
	// your magic here
	let retValue = text.replace(/^(")?.*?(")?$/, '$1Marklar$2');
	return retValue;
}

const app = require('express')();
const debug = require('debug')('pug-i18n-postparse:server');
const pugI18nPostparse = require('../..'); // const pugI18nPostparse = require('pug-i18n-postparse');

app.set('view engine', 'pug');
app.set('views', __dirname); // or your views directory

app.use(pugI18nPostparse.express('en', myI18nImplementation));

app.get('/', function (req, res /* , next */) {
	debug('serve page');
	res.locals.language = 'de'; // you can pass the selected language in locals
	res.render('index');
});

app.listen(3000);
