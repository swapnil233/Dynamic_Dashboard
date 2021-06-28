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

        // Display their name
        document.getElementById("user_name").innerHTML = userDisplayName
        console.log(userDisplayName)

        // Dropdown Menu
        document.getElementById('dropdown-icon-wrapper').addEventListener("click", (e) => {
            e.preventDefault()
            console.log("SD")

            document.getElementById("myDropdown").classList.toggle("show");
        })

        // Close the dropdown menu if the user clicks outside of it
        window.onclick = function (event) {
            if (!event.target.matches('.dropbtn')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }

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