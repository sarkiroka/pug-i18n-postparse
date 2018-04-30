/**
 * an express example
 * @author sarkiroka on 2018.04.22.
 */
const app = require('express')();
const debug = require('debug')('pug-i18n-postparse:server');
const path = require('path');
const pugI18nPostparse = require('../..'); // const pugI18nPostparse = require('pug-i18n-postparse');

const languageFilePath = path.join(__dirname, 'i18n.json');

app.set('view engine', 'pug');
app.set('views', __dirname); // or your views directory

app.use(pugI18nPostparse.express('en', languageFilePath)); // define the default language

app.get('/', function (req, res /* , next */) {
	debug('serve page');
	res.locals.language = 'de'; // you can pass the selected language in locals
	res.render('index');
});

app.listen(3000);
