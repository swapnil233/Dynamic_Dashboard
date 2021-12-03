// Import interactions
import {
    successPopup,
    errorPopup
} from "./modules/interactions.js"

// Import user functionalities
import {
    createNewCollection
} from './modules/userUpdates.js'

// While user is authenticated
auth.onAuthStateChanged((user) => {
    if (user) {

        // Get the ref to the user doc
        const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

        /*
        Friends requests schema:
        
        "friend_requests": {
            "FD16CRleo4h1g1rFnahAvHBVTQZ2": {
                "name": "John Doe",
                "profile_picture": "https://firebasestorage.googleapis.com/v0/b/social-media-app-f9f0d.appspot.com/o/profile_pictures%2Fprofile_picture.jpg?alt=media&token=f9f8f8f8-f9f8-f9f8-f9f8-f9f8f9f8f9f8",
                "received_time": "2020-04-20T15:00:00.000Z",
                "accepted": false
            }
        }
        */

        // List of user's notifications
        userDocRef.get().then((doc) => {
            const friend_requests = doc.data().notifications.friend_requests;
        })

    } else {
        // If the user is not logged in
        window.location.replace('../index.html')
    }
});