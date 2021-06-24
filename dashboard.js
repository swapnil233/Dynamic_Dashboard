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

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("user currently signed in")
    } else {
        window.location.replace('index.html')
    }
});

document.getElementById('logout_btn').addEventListener("click", (e) => {
    e.preventDefault();
    firebase.auth().signOut()
})