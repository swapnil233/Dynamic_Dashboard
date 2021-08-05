const openAndCloseModal = (currentUser) => {

    // DOM Elements
    const modal = document.querySelector(".modal");
    const openModalButton = document.querySelector("#update-profile-btn");
    const updateButton = document.querySelector("#update");
    const updateProfileForm = document.querySelector(".profile-update-form");
    const profileNameField = document.querySelector("#profile_name");
    const userBioField = document.querySelector("#user_bio");
    const closeModalButton = document.querySelector("#close-modal");

    // Open "update profile" modal when clicked from dropdown menu
    openModalButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Hide the dropdown menu after opening update profile modal
        document.querySelector(".dropdown-content").classList.toggle("show");

        // Show user's email address, current username
        document.querySelector("#profile_email").placeholder = currentUser.email;
        document.querySelector("#profile_name").placeholder = currentUser.displayName;

        // Show the user's bio
        db.collection('users').doc(currentUser.uid).get().then((doc) => {
            if (doc.data().bio !== undefined) {
                document.querySelector("#user_bio").placeholder = doc.data().bio;
            } else {
                document.querySelector("#user_bio").placeholder = "Create your bio"
            }
        })

        // If the modal isn't open:
        if (!modal.classList.contains("show")) {

            // Open the modal
            modal.classList.toggle("show");
        }

        // Upon clicking on "update" button inside modal:
        updateButton.addEventListener("click", (e) => {
            e.preventDefault();

            // Get values
            const newName = profileNameField.value;
            const newBio = userBioField.value;

            // Update displayName
            if (newName !== "") {
                updateUsername(newName)

                // Update username inside Firestore database
                db.collection('users').doc(currentUser.uid).set({
                    name: newName
                }, {
                    merge: true
                })
            }

            // Update bio
            if (newBio !== "") {
                // Update bio inside Firebase database
                db.collection('users').doc(currentUser.uid).set({
                    bio: newBio
                }, {
                    merge: true
                }).then(() => {
                    // Show the user's bio
                    db.collection('users').doc(currentUser.uid).get().then((doc) => {
                        if (doc.data().bio !== undefined) {
                            document.querySelector("#user_bio").placeholder = doc.data().bio;
                        } else {
                            document.querySelector("#user_bio").placeholder = "Create your bio"
                        }
                    })
                })
            }

            // Update dp
            if (file !== "") {
                // Start the loading animation
                startLoadingAnimation(
                    updateButton,
                    document.querySelector(".update_loader"),
                    document.querySelector(".update_btn_text")
                )

                // Once the pfp has been updated, end the loading animation
                updateDp(currentUser).then(() => {
                    endLoadingAnimation(
                        updateButton,
                        document.querySelector(".update_loader"),
                        document.querySelector(".update_btn_text")
                    )

                    auth.currentUser.reload();
                    updateProfileForm.reset();
                })
            }

            // Close up the modal after tasks are done
            // modal.classList.toggle("show")
            auth.currentUser.reload();
            updateProfileForm.reset();
        })
    })

    // Close modal upon clicking the "x"
    closeModalButton.addEventListener("click", () => {
        modal.classList.toggle("show");
    })
}

export { openAndCloseModal }