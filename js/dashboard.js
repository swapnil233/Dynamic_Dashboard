// "auth" and "db" defined inside 'dashboard.html' file

auth.onAuthStateChanged(function (user) {
    if (user) {

        // Display user name
        updateDisplayNameInDOM(user)

        // Display user's set DP
        db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.data().dp_URL) {
                document.querySelector("#nav_dp").src = doc.data().dp_URL;
            }
        })

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
            document.getElementById('logout_btn').innerHTML = 'Logging Out...'
            e.preventDefault();
            auth.signOut();
        })

        // db.collection("users").get().then(docs => {
        //     docs.docs.forEach(doc => {
        //         console.log(doc.data())
        //     });
        // })

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
    const userBioField = document.querySelector("#user_bio");
    const closeModalButton = document.querySelector("#close-modal");

    // Open "update profile" modal when clicked from dropdown menu
    openModalButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Hide the dropdown menu after opening update profile modal
        document.querySelector(".dropdown-content").classList.toggle("show");

        // Show user's email address, current username, and bio in placeholders
        document.querySelector("#profile_email").placeholder = currentUser.email;
        document.querySelector("#profile_name").placeholder = currentUser.displayName;

        db.collection('users').doc(currentUser.uid).get().then((doc) => {
            document.querySelector("#user_bio").placeholder = doc.data().bio;
        })

        // If the modal doesn't have the CSS "show" class:
        if (!modal.classList.contains("show")) {

            // Toggle that class into the modal
            modal.classList.toggle("show");

            // Upon clicking on "update" button inside modal:
            updateButton.addEventListener("click", (e) => {
                e.preventDefault();

                // Get values
                const newName = profileNameField.value;
                const bio = userBioField.value;

                // Update displayName
                if (newName !== "") {
                    updateUsername(newName);
                    // Update username inside Firestore database
                    db.collection('users').doc(currentUser.uid).set({
                        name: newName
                    }, {
                        merge: true
                    })
                }

                // Update bio
                if (bio !== "") {
                    // Update bio inside Firebase database
                    db.collection('users').doc(currentUser.uid).set({
                        bio: userBioField.value
                    }, {
                        merge: true
                    })
                }

                // Update dp
                if (file !== "") {
                    updateDp(currentUser)
                }

                // Close up the modal after tasks are done
                modal.classList.toggle("show")
                auth.currentUser.reload();
                updateProfileForm.reset();
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
        updateDisplayNameInDOM(auth.currentUser)
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

// Grab dp img and store it in file var
let file = {}
const chooseFile = (e) => {
    // Get the file from local machine
    file = e.target.files[0]
    console.log(file)
    console.log(file.name)
    console.log(file.type)
}

// // Store dp in storage as file, and db as link
// const updateDp = (currentUser) => {
//     // Check if new dp has been added/exists.
//     if ("name" in file) {
//         // Check if uploaded file is an image
//         if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/gif") {
//             alert("You can only upload .jpeg, .jpg, .png and .gif under 10mb")
//             return
//         }

//         // Check image file size
//         if (file.size/1024/1024>6) {
//             alert("The image size must be under 6 mb")
//             return
//         }

//         // Create storage ref & put the file in it
//         storage
//             .ref("users/" + currentUser.uid + "/profileImage")
//             .put(file)
//             .then(() => {
//                 // success => get download link, put it in DB, update dp img src
//                 storage
//                     .ref("users/" + currentUser.uid + "/profileImage")
//                     .getDownloadURL()
//                     .then(imgURL => {
//                         db
//                             .collection("users")
//                             .doc(currentUser.uid)
//                             .set({
//                                 dp_URL: imgURL,
//                                 dp_URL_last_modified: file.lastModifiedDate
//                             }, {
//                                 merge: true
//                             })
//                         document.querySelector("#nav_dp").src = imgURL;
//                     })
//                 console.log("success")
//             }).catch(() => {
//                 console.log(error.message)
//             })
//     } else {
//         console.log("Empty/no file")
//     }
// }

// Store dp in storage as file, and db as link

const updateDp = async (currentUser) => {
    // Check if new dp has been added/exists.
    if ("name" in file) {
        console.log("files here")
        try {
            // Check if uploaded file is an image
            if (
                file.type !== "image/jpeg" &&
                file.type !== "image/jpg" &&
                file.type !== "image/png" &&
                file.type !== "image/gif"
            ) {
                alert("You can only upload .jpeg, .jpg, .png and .gif under 10mb");
                return;
            }

            // Check image file size
            if (file.size / 1024 / 1024 > 10) {
                alert("The image size must be under 10mb");
                return;
            }
            console.log("File passed requirements")

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
                dp_URL_last_modified: file.lastModifiedDate,
            }, {
                merge: true,
            });
            console.log("Document Added")
            document.querySelector("#nav_dp").src = imgURL;
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("Empty/no file");
    }
};