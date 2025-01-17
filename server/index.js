require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middlewares/authMiddleware');
const app = express();
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

app.use((req, res, next) => {
   console.log('Database request made');
   next();
});

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
   app.set('db', db);
   console.log('Database connected')
})

app.use(session({
   resave: true,
   saveUninitialized: false,
   secret: SESSION_SECRET
}));

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);


app.listen(SERVER_PORT, () => console.log(`Server listening on ${SERVER_PORT}`));