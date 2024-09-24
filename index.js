const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const Filestore = require('session-file-store')(session);
const flash = require('express-flash');
const conn = require ('./db/conn')
const toughtsRoutes = require('./routes/toughtsRoutes')

const app = express();

// import models
const Tought = require('./models/Tought')
const User = require('./models/User');
const ToughtController = require('./controllers/ToughtController');

//import Routes
const thoughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes');
//import controllers
const ThoughtController = require('./controllers/ToughtController');

// template engine
app.engine('handlebars',exphbs.engine())
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));

// helps receiving json
app.use(express.json());

//sesion midleware
//save session in a determinate local
app.use(
    session({
        name: "session",
        secret: "we_secret",
        resave: false,
        saveUninitialized: false,
        store: new Filestore({
            logFn: function(){},
            path: require("path").join(require('os').tmpdir(), "sessions"),
        }),
        cookie:{
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now()+ 360000),
            httpOnly: true // use only for the localhost
        }

    }),
)

// flash messages
app.use(flash())

//public path
app.use(express.static('public'))

//set the session to res
// pass the informations of user to front
app.use((req, res,next) => {

    if (req.session.userid){
        res.locals.session = req.session
    }
    next()
})

//routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)
app.get('/',ToughtController.showToughts)

conn.
sync()
.then(()=> app.listen(3000))
.catch(err => console.log(err))