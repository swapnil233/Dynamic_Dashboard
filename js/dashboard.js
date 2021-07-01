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
            // if user is unverified: show the option to verify and upon clicking it, verify the user.
            document.querySelector("#verify-email-button").classList.toggle("show");
            varifyEmail()
        } else {
            document.querySelector(".verified").classList.toggle("show")
        }

    } else {
        // If the user is not logged in
        window.location.replace('index.html')
    }
});

// Database
db.collection('guides').get().then(snapshot => {
    console.log(snapshot.docs)
})

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

    // Open "update profile" modal when clicked from dropdown menu
    openModalButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Hide the dropdown menu after opening update profile modal
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
        // Once the name has been updated, append it to the user dropdown menu
        updateDisplayNameInDOM()
    });
}

// Verify Email Address
const varifyEmail = () => {
    document.querySelector("#verify-email-button").addEventListener("click", (e) => {
        e.preventDefault();

        // Use Firebase's verification method to send the user a verification link
        firebase.auth().currentUser.sendEmailVerification()
            .then(() => {
                // Hide the "Verify" button upon clicking it
                document.querySelector("#verify-email-button").classList.toggle("show");
            });
    })
}

// Show user's display name inside the DOM
const updateDisplayNameInDOM = () => {
    document.querySelector("#user_name").innerHTML = firebase.auth().currentUser.displayName;
}

// Logout
document.getElementById('logout_btn').addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut();
})