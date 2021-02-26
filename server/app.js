const express = require('express');
const Session = require('express-session');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const middleware = require('connect-ensure-login');
const FileStore = require('session-file-store')(Session);
const config = require('./config/default');
const flash = require('connect-flash');
const port = 333;
const app = express();
const passport = require('./auth/passport')


mongoose.connect('mongodbL//127.0.0.1/nodStream', { useNewUrlParser: true});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));
app.use(flash())
;
app.use(require('cookie-parser')());
app.use(bodyParse.urlencoded({extended:true}));
app.use(bodyParse.json({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(Session({
    store: new FileStore({
        path : './server/sessions'
    }),
    secret: config.server.secrey,
    maxAge : Date().now + (60 * 1000 * 30)
}));

app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));

app.get('*', middlware.ensureLoggedIn(), (req, res) =>{
    res.render('index')
})

app.listen(port, () => console.log(`App listening on ${port}!`));