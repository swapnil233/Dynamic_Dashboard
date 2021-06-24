var firebaseConfig = {
    apiKey: "AIzaSyAj09MQ7pVM7Fqo6G-IvRGYGf5To7bQyFk",
    authDomain: "simplelogin-369dd.firebaseapp.com",
    projectId: "simplelogin-369dd",
    storageBucket: "simplelogin-369dd.appspot.com",
    messagingSenderId: "334337354126",
    appId: "1:334337354126:web:d647adefa26d0df2605cdf"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.getElementById('submit_btn').addEventListener('click', (e) => {
    e.preventDefault();

    var user_name = document.getElementById('user_name').value;
    var user_email = document.getElementById('user_email').value;
    var user_pass = document.getElementById('user_pass').value;

    // Log In
    firebase.auth().signInWithEmailAndPassword(user_email, user_pass)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
});