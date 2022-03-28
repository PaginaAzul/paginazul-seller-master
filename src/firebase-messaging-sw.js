importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDspMax_g2Wdxi5IJ5Zqqhed-awONhMQCA",
    authDomain: "proven-cider-246110.firebaseapp.com",
    databaseURL: "https://proven-cider-246110.firebaseio.com",
    projectId: "proven-cider-246110",
    storageBucket: "proven-cider-246110.appspot.com",
    messagingSenderId: "219912582887",
    appId: "1:219912582887:web:04befb8470d8de1d605442",
    measurementId: "G-71YHCY74D4"
});

const messaging = firebase.messaging();
