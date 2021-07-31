firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location.replace('dashboard.html')
    } else {
        console.log("no user signed in")
    }
});

document.getElementById('login_btn').addEventListener('click', (e) => {
    e.preventDefault();

    // Start loading animation
    document.querySelector(".loader").classList.toggle("hidden")
    document.querySelector(".btn_text").classList.toggle("hidden")

    // Get email and pass values
    const user_email = document.getElementById('user_email').value;
    const user_pass = document.getElementById('user_pass').value;

    // Log In
    firebase.auth().signInWithEmailAndPassword(user_email, user_pass)
        // If sign-in is not successful
        .catch((error) => {
            // Stop loading animation & revert to "Log In" prompt
            document.querySelector(".loader").classList.toggle("hidden")
            document.querySelector(".btn_text").classList.toggle("hidden")

            // Alert the user.
            window.alert(error.message)
        });
});