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

document.getElementById('login_btn').addEventListener('click', (e) => {
    e.preventDefault();

    var user_name = document.getElementById('user_name').value;
    var user_email = document.getElementById('user_email').value;
    var user_pass = document.getElementById('user_pass').value;

    // Log In
    firebase.auth().signInWithEmailAndPassword(user_email, user_pass)
        .then((userCredential) => {
            // If sign in is successful
            var user = userCredential.user;

            var current_user = firebase.auth().currentUser;
            
            // Updating user's profile with the name they provided in the form
            current_user.updateProfile({
                displayName: user_name
            })

            window.location.replace("dashboard.html")
        })
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