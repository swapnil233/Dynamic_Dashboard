import {
    firebaseConfig
} from './firebase_keys.js';

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        // Fetch user's data from firebase.auth().currentUser aka the user instance for later 
        const userDisplayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;

        // Don't use the uid for varification, use user.getToken() instead
        const uid = user.uid;

        document.getElementById("user_name").innerHTML = userDisplayName

        console.log(userDisplayName)

    } else {
        window.location.replace('index.html')
    }
});

// Logout
document.getElementById('logout_btn').addEventListener("click", (e) => {
    e.preventDefault();
    firebase.auth().signOut().then(() => {

        // Will use this async method for later tasks
        
        return
    })
})