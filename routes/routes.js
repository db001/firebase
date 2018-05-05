const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Firebase setup
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json');
const firebase = require('firebase');

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

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            admin.auth().createUserWithEmailAndPassword(email, hash)
                .catch(error => {
                    console.log(error.code, error.message);
                })
        })
    });
    res.redirect('/');
});

module.exports = router;