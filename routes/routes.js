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
const ref = db.ref("/");

router.get('/', (req, res) => {
    ref.once("value", function (snapshot) {
        const users = snapshot.val();
        console.log(users);
        res.render('index', {
            title: 'Home',
            ...users
        });
    }, function (errorObject) {
        console.log(`The read failed: ${errorObject.code}`);
    });
});

module.exports = router;