const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')

mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', ()=>{
  console.log('Connected to mongodb..');
})

const app = express();

let Article = require('./models/articles')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());

app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use((req, res, next)=>{
  res.locals.messages = require('express-messages')(req, res);
  next();
})

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;
    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req,res,next)=>{
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res)=>{
 Article.find({}, (err, articles)=>{
   if(err){
     console.log('error');
   }
   else{
     res.render('index', {
       title: 'Articles',
       articles: articles
     });
   }
 })

});

let articles = require('./routes/articles');
let users = require('./routes/users');
let members = require('./routes/members')
app.use('/articles', articles);
app.use('/users', users);
app.use('/members', members)



app.listen(3000, ()=>{
  console.log("server started");
});