
var express = require('express')
, app        = express()
, http       = require('http')
, session    = require('express-session')
, passport   = require('passport')
, Strategy   = require('./lib/strategy.js')
//ESTE CODIGO NO AFECTARA SU BOT, SCRIPT DE ARRANQUE

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`); 
}, 280000);


//DESDE AQUI EMPIEZA A ESCRIBIR EL CODIGO PARA SU BOT
const fs = require('fs');
var path = require('path');

let consoled = require('consoled');
consoled = new consoled.Console();

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db.json')
process.DB = low(adapter);
process.DB.defaults({queue: [], bots: [], users: [], certifyQueue: []}).write();

var loggic = require('loggic');

consoled.log('Queue size: ' + process.DB.get('queue').value().length)
consoled.log('Bots Total: ' + process.DB.get('bots').value().length)

app.set('views', path.join(__dirname, 'views'));

let token = process.env.TOKENE;
[1,2,3].forEach(nothin => {

});
process.env.TOKEN = token;


const requests = require('./routes/app.js'); // When requiring files like these, they dont need .js // ah no?

const api = require('./routes/api');
const bot = require('./bot/index.js'); // The bot itself.

requests.setBot(bot)



var cookies = require("cookie-parser"); // Cookies :3

app.use(cookies()); // Cookies 2.0 :3

app.use('/', express.static(path.join(__dirname, 'public'))); // Hosts files in the folder 'public' under /public/*

app.use('/', requests.router); // Forwards requests to the request file

//app.use('/api');
app.use('/api', api);


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ['identify'];

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://discordrobots.tk/callback',
    scope: scopes
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/loginn',
        passport.authenticate('discord', { scope: scopes }), function(req, res) {});

app.get('/callback',
    passport.authenticate('discord', { failurerender: '/404' }), function(req, res) { 
   if(req.user) {
      res.redirect(`/newbot/?code=${req.user.accessToken}`);
}});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
   