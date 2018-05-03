const express = require('express');
const router = express.Router();

// Firebase setup
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://url-sharer-98088.firebaseio.com/'
});

const db = admin.database();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'
    });
});

router.get('/users', (req, res) => {
    const ref = db.ref("/");
    ref.once("value", function (snapshot) {
        const users = snapshot.val();

        res.render('users', {
            title: 'User index',
            ...users
        });
    }, function (errorObject) {
        console.log(`The read failed: ${errorObject.code}`);
    });
});

router.get('/user/:username', (req, res) => {
    const userId = req.params.username;
    const userRef = db.ref("/users");
    userRef.once("value", snapshot => {
        const users = snapshot.val();
        Object.keys(users).map(ele => {
            if (users[ele].username === userId) {
                console.log('Match');
                res.send(users[ele]);
            }
        });
    });
});

module.exports = router;