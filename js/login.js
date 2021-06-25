import {
    firebaseConfig
} from './firebase_keys.js';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.getElementById('login_btn').addEventListener('click', (e) => {
    e.preventDefault();
    
    var user_email = document.getElementById('user_email').value;
    var user_pass = document.getElementById('user_pass').value;

    // Log In
    firebase.auth().signInWithEmailAndPassword(user_email, user_pass)
        // If sign-in is not successful
        .catch((error) => {
            window.alert(error.message)
        });
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location.replace('dashboard.html')
    } else {
        console.log("no user signed in")
    }
});