firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        // Display user name
        updateDisplayNameInDOM(user)

        // Dropdown Nav Menu
        dropDownMenu()

        // Modal
        updateProfileModal(user);

        // Email Verification
        if (!user.emailVerified) {
            // Show verify link
            document.querySelector("#verify-email-button").classList.toggle("show");

            // Verify user
            verifyEmail(user)
        } else {
            document.querySelector(".verified").classList.toggle("show")
        }

        // Logout
        document.getElementById('logout_btn').addEventListener("click", (e) => {
            e.preventDefault();
            auth.signOut();
        })

    } else {
        // If the user is not logged in
        window.location.replace('index.html')
    }
});

const dropDownMenu = () => {
    document.querySelector("#profile-dropdown").addEventListener("click", (e) => {
        // Hide/show the dropdown menu when arrow is clicked
        document.querySelector(".dropdown-content").classList.toggle("show");
    });
}

const updateProfileModal = (currentUser) => {

    // DOM Elements
    const modal = document.querySelector(".modal");
    const openModalButton = document.querySelector("#update-profile-btn");
    const updateButton = document.querySelector("#update");
    const updateProfileForm = document.querySelector(".profile-update-form");
    const profileNameField = document.querySelector("#profile_name");
    const closeModalButton = document.querySelector("#close-modal");

    // Open "update profile" modal when clicked from dropdown menu
    openModalButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Hide the dropdown menu after opening update profile modal
        document.querySelector(".dropdown-content").classList.toggle("show");

        // Show user's email address and current username in placeholders
        document.querySelector("#profile_email").placeholder = currentUser.email;
        document.querySelector("#profile_name").placeholder = currentUser.displayName;

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
                    firebase.auth().currentUser.reload();
                } else {
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
        // Once the name has been updated, append it to the user dropdown menu
        updateDisplayNameInDOM(firebase.auth().currentUser)
    });
}

// Verify Email Address
const verifyEmail = (currentUser) => {
    document.querySelector("#verify-email-button").addEventListener("click", (e) => {
        e.preventDefault();

        // Use Firebase's verification method to send the user a verification link
        currentUser.sendEmailVerification()
            .then(() => {
                // Hide the "Verify" button upon clicking it
                document.querySelector("#verify-email-button").classList.toggle("show");

                // Start a 1 second listener to detect when user has verified their email address
                this.emailVerificationListener = setInterval(() => {
                    currentUser.reload()
                        .then(ok => {
                            // If the user verifies their email, kill the process and display the verification checkmark.
                            if (currentUser.emailVerified) {
                                document.querySelector(".verified").classList.toggle("show");
                                clearInterval(this.emailVerificationListener);
                            }
                        })
                }, 1000)
            });
    })
}

// Show user's display name inside the DOM
const updateDisplayNameInDOM = (currentUser) => {
    document.querySelector("#user_name").innerHTML = currentUser.displayName;
}