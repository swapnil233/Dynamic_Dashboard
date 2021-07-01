firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        // Display user name
        updateDisplayNameInDOM()

        // Dropdown Nav Menu
        dropDownMenu()

        // Modal
        updateProfileModal();

        // Email Verification
        if (!user.emailVerified) {
            document.querySelector("#verify-email-button").classList.toggle("show");
            varifyEmail()
        } else {
            document.querySelector(".verified").classList.toggle("show")
        }


    } else {
        window.location.replace('index.html')
    }
});

// Database
db.collection('guides').get().then(snapshot => {
    console.log(snapshot.docs)
})

// Fetch user's data
const fethUserData = (user) => {
    const userData = {
        userDisplayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid
    };
    return userData;
};

const dropDownMenu = () => {
    document.querySelector("#profile-dropdown").addEventListener("click", (e) => {
        // Hide/show the dropdown menu when arrow is clicked
        document.querySelector(".dropdown-content").classList.toggle("show");
    });
}

const updateProfileModal = () => {

    // DOM Elements
    const modal = document.querySelector(".modal");
    const openModalButton = document.querySelector("#update-profile-btn");
    const updateButton = document.querySelector("#update");
    const updateProfileForm = document.querySelector(".profile-update-form");
    const profileNameField = document.querySelector("#profile_name");
    const closeModalButton = document.querySelector("#close-modal");

    // Open "update profile" modal when clicked
    openModalButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Hide the dropdown menu
        document.querySelector(".dropdown-content").classList.toggle("show");

        // Show user's email address in the email field
        document.querySelector("#profile_email").placeholder = firebase.auth().currentUser.email;;

        // If the modal doesn't have the CSS "show" class:
        if (!modal.classList.contains("show")) {

            // Toggle that class into the modal
            modal.classList.toggle("show");

            // Upon clicking on "update" button inside modal:
            updateButton.addEventListener("click", (e) => {
                e.preventDefault();

                // Get value of new displayName
                const newName = profileNameField.value;

                // Update displayName.
                if (newName !== "") {
                    updateUsername(newName)
                    updateProfileForm.reset();
                    modal.classList.toggle("show")
                } else if (newName == "") {
                    window.alert("Must choose a new name to update")
                }
            })
        }
    })

    // Close profile updating modal upon clicking the "x"
    closeModalButton.addEventListener("click", () => {
        modal.classList.toggle("show");
    })
}

// Update user's display name
const updateUsername = (newName) => {
    auth.currentUser.updateProfile({
        displayName: newName
    }).then(() => {
        updateDisplayNameInDOM()
    });
}

// Verify Email Address
const varifyEmail = () => {
    const verifyEmailButton = document.querySelector("#verify-email-button");

    verifyEmailButton.addEventListener("click", (e) => {
        e.preventDefault();

        firebase.auth().currentUser.sendEmailVerification()
            .then(() => {
                document.querySelector("#verify-email-button").classList.toggle("show");
                console.log("verification email sent")
            });
    })
}

// Show user's display name inside the DOM
const updateDisplayNameInDOM = () => {
    document.querySelector("#user_name").innerHTML = fethUserData(firebase.auth().currentUser).userDisplayName;
}

// Logout
document.getElementById('logout_btn').addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {

        // Will use this async method for later tasks

        return
    })
})