import {
    firebaseConfig
} from './firebase_keys.js'

firebase.initializeApp(firebaseConfig);

document.getElementById('signup_btn').addEventListener("click", (e) => {
    e.preventDefault();

    var user_name = document.getElementById('user_name').value;
    var user_email = document.getElementById('user_email').value;
    var user_pass = document.getElementById('user_pass').value;

    // Sign Up
    firebase.auth().createUserWithEmailAndPassword(user_email, user_pass)
        .then((userCredentials) => {
            firebase.auth().currentUser.updateProfile({
                displayName: user_name
            })
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
})

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location.replace('dashboard.html')
    } else {
        return
    }
});