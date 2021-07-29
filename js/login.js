firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location.replace('dashboard.html')
    } else {
        console.log("no user signed in")
    }
});

document.getElementById('login_btn').addEventListener('click', (e) => {
    e.preventDefault();

    const user_email = document.getElementById('user_email').value;
    const user_pass = document.getElementById('user_pass').value;

    // Log In
    firebase.auth().signInWithEmailAndPassword(user_email, user_pass)
        .then(() => {
            document.getElementById('login_btn').innerHTML = "Logging In..."
        }) 
        // If sign-in is not successful
        .catch((error) => {
            window.alert(error.message)
        });
});