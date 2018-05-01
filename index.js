const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const promisify = require('es6-promisify');

require('dotenv').config();

const app = express();

const routes = require('./routes/routes');

// Firebase setup
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://url-sharer-98088.firebaseio.com/'
});

const db = admin.database();
const ref = db.ref("/");
ref.once("value", function (snapshot) {
    console.log(snapshot.val());
}, function (errorObject) {
    console.log(`The read failed: ${errorObject.code}`);
});

const usersRef = ref.child('users');
usersRef.update({
    bob: {
        email: "bob@test.co.uk",
        firstName: "Mikey"
    },
    julio: {
        email: "jman@example.com",
        firstName: "Julio"
    }
});
// usersRef.update({
//     "bob/firstName": "bobby"
// });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running on Port ${server.address().port}`);
});