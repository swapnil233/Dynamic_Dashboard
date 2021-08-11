// "auth" and "db" defined inside './pages/dashboard.html' file

auth.onAuthStateChanged((user) => {
    if (user) {

        // Display user name
        updateDisplayNameInDOM(user)

        // Show the user's pfp
        db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.data().dp_URL) {
                document.querySelector("#nav_dp").src = doc.data().dp_URL;
            }
        })

        // Modal
        openAndCloseModal(user);

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

            // Start loading animation
            startLoadingAnimation(
                document.getElementById('logout_btn'),
                document.querySelector(".loader"),
                document.querySelector(".btn_text")
            )

            // Sign the user out
            auth.signOut()
                .catch((error) => {
                    // If signout can't be completed, revert loading animation
                    document.querySelector(".loader").classList.toggle("hidden")
                    document.querySelector(".btn_text").classList.toggle("hidden")
                    window.alert(error)
                });
        })

    } else {
        // If the user is not logged in
        window.location.replace('../index.html')
    }
});

// Dropdown Menu
document.querySelector("#profile-dropdown").addEventListener("click", (e) => {
    // Hide/show the dropdown menu when arrow is clicked
    document.querySelector(".dropdown-content").classList.toggle("show");
});

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
                startLoadingAnimation(
                    updateButton,
                    document.querySelector(".update_loader"),
                    document.querySelector(".update_btn_text")
                )

                updateUsername(newName).then(() => {
                    // Update username inside Firestore database
                    db.collection('users').doc(currentUser.uid).set({
                        name: newName
                    }, {
                        merge: true
                    })
                        
                    endLoadingAnimation(
                        updateButton,
                        document.querySelector(".update_loader"),
                        document.querySelector(".update_btn_text")
                    )
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

                    successPopup("Profile updated successfully!")
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

// Update username
const updateUsername = async (newName) => {
    await auth.currentUser.updateProfile({
        displayName: newName
    })

    // Once the name has been updated, append it to the user dropdown menu
    updateDisplayNameInDOM(auth.currentUser)

    // Update username in placeholder
    document.querySelector("#profile_name").placeholder = auth.currentUser.displayName;
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

// Grab pfp and store it in 'file'
let file = {}
const chooseFile = (e) => {
    // Get the file from local machine
    file = e.target.files[0]
    console.log(file)
    console.log(file.name)
    console.log(file.type)
}

// Update pfp
const updateDp = async (currentUser) => {
    // Check if new dp has been added/exists.
    if ("name" in file) {
        try {
            // Check if uploaded file is an image
            if (
                file.type !== "image/jpeg" &&
                file.type !== "image/jpg" &&
                file.type !== "image/png" &&
                file.type !== "image/gif"
            ) {
                // Create a pop-up to notify user that the file is not an image
                errorPopup("File is not an image");
                return;
            }

            // Check image file size
            if (file.size / 1024 / 1024 > 10) {
                // Create a pop-up to notify user that the file is too large
                errorPopup("Size too large");
                return;
            }
            console.log("Image passed requirements")

            storage.ref("users/" + currentUser.uid + "/profileImage").put(file).then

            // Create storage ref & put the file in it
            const userPicRef = storage.ref(
                "users/" + currentUser.uid + "/profileImage"
            );

            await userPicRef.put(file);
            console.log("Image uploaded")

            // success => get download link, put it in DB, update dp img src
            const imgURL = await userPicRef.getDownloadURL();
            console.log(`Image URL: ${imgURL}`)
            await db.collection("users").doc(currentUser.uid).set({
                dp_URL: imgURL,
                dp_URL_last_modified: file.lastModified,
            }, {
                merge: true,
            });

            console.log("Document Added")
            document.querySelector("#nav_dp").src = imgURL;

            // Clear out the file
            file = ""
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("Empty/no file");
    }
}

const startLoadingAnimation = (buttonElement, loaderElement, buttonTextElement) => {
    // buttonElement, loaderElement, and buttonTextElement are all DOM elements.

    // start loading animation if loaderElement is hidden
    if (loaderElement.classList.contains("hidden")) {
        buttonElement.style.cursor = 'default'
        buttonElement.disabled = true
        loaderElement.classList.remove("hidden");
        buttonTextElement.classList.add("hidden");
    }
}

const endLoadingAnimation = (buttonElement, loaderElement, buttonTextElement) => {
    // buttonElement, loaderElement, and buttonTextElement are all DOM elements.

    // Hide the loading animation if loading animation is present
    if (!loaderElement.classList.contains("hidden")) {
        buttonElement.style.cursor = 'pointer'
        buttonElement.disabled = false
        loaderElement.classList.add("hidden");
        buttonTextElement.classList.remove("hidden");
    }
}

const errorPopup = (error) => {
    const errorPopup = document.createElement("div")
    errorPopup.classList.add("error-popup")
    errorPopup.innerHTML = error
    document.body.appendChild(errorPopup)
    setTimeout(() => {
        document.body.removeChild(errorPopup)
    }, 3000)
}

const successPopup = (success) => {
    const successPopup = document.createElement("div")
    successPopup.classList.add("success-popup")
    successPopup.innerHTML = success
    document.body.appendChild(successPopup)
    setTimeout(() => {
        document.body.removeChild(successPopup)
    }, 3000)
}