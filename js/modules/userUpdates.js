// Import errorPopup and successPopup from interactions.js
import { errorPopup, successPopup } from "./interactions.js";

// Grab pfp and store it in 'file'
let file = {}
window.chooseFile = (e) => {
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
                errorPopup("File must be .jpg, .jpeg, .png, or .gif");
                return;
            }

            // Check image file size
            if (file.size / 1024 / 1024 > 9) {
                // Create a pop-up to notify user that the file is too large
                errorPopup("File size must be less than 10mb");
                return;
            }
            console.log("Image passed requirements")
            console.log("Uploading picture");

            // Create storage ref & put the file in it
            const userPicRef = storage.ref("users/" + currentUser.uid + "/profileImage");

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

            // Success message
            successPopup("Profile Picture Updated Successfully!");
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("Empty/no file");
    }
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

                // Show a success message
                successPopup("Verification email sent!");
            });
    })
}

// Show user's display name inside the DOM
const updateDisplayNameInDOM = (currentUser) => {
    document.querySelector("#user_name").innerHTML = currentUser.displayName;
}

export {file, updateDp, updateUsername, updateDisplayNameInDOM, verifyEmail}