var unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location.replace('dashboard.html')
    } else {
        return
    }
});

document.querySelector('#signup_btn').addEventListener("click", (e) => {
    e.preventDefault();

    // Turn off auth state change listner
    unsubscribe();

    // Start loading animation
    document.querySelector(".loader").classList.toggle("hidden")
    document.querySelector(".btn_text").classList.toggle("hidden")

    var user_email = document.getElementById('user_email').value;
    var user_pass = document.getElementById('user_pass').value;
    var user_name = document.getElementById('user_name').value;

    // Sign Up
    firebase.auth().createUserWithEmailAndPassword(user_email, user_pass)
        // Success
        .then((userCredentials) => {

            // Update the user's profile
            userCredentials.user.updateProfile({
                displayName: user_name
            })

            // Send a verification email
            userCredentials.user.sendEmailVerification();

            return firebase.firestore().collection('users').doc(userCredentials.user.uid).set({
                name: user_name,
                email: user_email
            })
        })
        .then(() => {
            window.location.replace('dashboard.html')
        })
        // Errors
        .catch(function (error) {
            // Stop loading animation & revert to "Log In" prompt
            document.querySelector(".loader").classList.toggle("hidden")
            document.querySelector(".btn_text").classList.toggle("hidden")

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