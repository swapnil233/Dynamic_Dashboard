document.querySelector('#login_btn').addEventListener("click", (e) => {
    e.preventDefault();

    const email = document.querySelector('#user_email').value

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            window.alert("Password reset link sent to your email.")
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            
            window.alert(errorCode + " " + errorMessage)
        });
})