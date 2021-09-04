// Import errorPopup and successPopup from interactions.js
import {
    errorPopup,
    successPopup
} from "./interactions.js";

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
                dp_URL_last_modified: firebase.firestore.FieldValue.serverTimestamp()
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

// Creating a new movies collection
const createNewCollection = () => {
    event.preventDefault();

    // Get the field values for the new collection name and description
    const newCollectionName = document.querySelector(".search-input").value
    const newCollectionDescription = document.querySelector(".description").value

    // Ref to the user's doc
    const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

    // Check if newCollectionName is valid
    newCollectionNameErrorChecks(newCollectionName)

    // If newCollectionName is already a key in the movies_collections object inside userDocRef, show an error
    userDocRef.get().then((doc) => {
        if (doc.data().movies_collections[newCollectionName]) {
            errorPopup(`${newCollectionName} is already a collection`)
            document.querySelector(".search-input").value = "";
            document.querySelector(".description").value = "";
            return
        } else {
            // Get the current timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            // Create new collection inside movies_collections
            userDocRef.set({
                movies_collections: {
                    // Need to put it in brackets because using ES6's "computed property" syntax
                    [newCollectionName]: {
                        dateCreated: timestamp,
                        description: newCollectionDescription,
                        createdBy: firebase.auth().currentUser.email,
                        movies: []
                    }
                }
            }, {
                merge: true
            }).then(() => {
                successPopup(`${newCollectionName} collection has been created`)
                document.querySelector(".search-input").value = "";
                document.querySelector(".description").value = "";

                // Add the new collection into .existing-collections
                document.querySelector(".existing-collections").innerHTML += `
                <div class="collection-name-container">
                    <p class="collection-name">
                        ${newCollectionName}
                    </p>
                </div>  
                `
            })
        }
    })
}

// New Collection Name Error Checks
const newCollectionNameErrorChecks = (newCollectionName) => {
    
    // Use regex to check if newCollectionName is just spaces   
    if (newCollectionName.match(/^\s*$/)) {
        errorPopup("Collection name cannot be empty");
        return false;
    }

    // Check if newCollectionName is "All", "all", "", or null (empty string)
    if (newCollectionName === "All" || newCollectionName === "all" || newCollectionName === "" || newCollectionName === null) {
        errorPopup("Please use a valid collection name");
        return false;
    }

    // Check if newCollectionName is under 20 characters and not just spaces 
    if (newCollectionName.length > 20) {
        errorPopup("Collection name cannot be more than 20 characters");
        return false;
    }

    return true;
}

// Edit Collections (delete and rename)


export {
    file,
    updateDp,
    updateUsername,
    updateDisplayNameInDOM,
    verifyEmail,
    createNewCollection,
    newCollectionNameErrorChecks
}