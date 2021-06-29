// Get data
db.collection('guides').get().then(snapshot => {
    console.log(snapshot.docs)
})

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        // Fetch user's data for later
        const userDisplayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;

        // Don't use the uid for varification, use user.getToken() instead
        const uid = user.uid;

        // Display their name
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

// Dropdown menu
document.querySelector("#profile-dropdown").addEventListener("click", (e) => {
    // Hide/show the dropdown menu when arrow is clicked
    document.querySelector(".dropdown-content").classList.toggle("show");
})