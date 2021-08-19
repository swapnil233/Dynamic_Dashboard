// Import interactions
import {
    successPopup,
    errorPopup
} from "./modules/interactions.js"

// While user is authenticated
auth.onAuthStateChanged((user) => {
    if (user) {

        const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

        // Get the movie collections
        userDocRef
            .get()
            .then((doc) => {

                // If a "movies_collections" object doesn't exist, create it
                if (!doc.data().movies_collections) {
                    userDocRef.set({
                        movies_collections: {}
                    }, {merge: true})

                    return
                }

                // movies_collections ref
                const movies_collections = doc.data().movies_collections;

                if (movies_collections == "") {
                    console.log("No movies collections exist yet")
                    return
                }

                // For each movies_collections key
                Object.keys(movies_collections).forEach(movies_collection_object => {

                    // Get movies_collections -> {collection_name} -> movies array
                    const movies_collections_movies_array = movies_collections[movies_collection_object].movies;

                    // For each imdbID inside movies_collections -> {collection_name} -> movies array
                    movies_collections_movies_array.forEach(movie_imdbID => {

                        // Get movie's details
                        axios.get("https://www.omdbapi.com/?i=" + movie_imdbID + "&apikey=56bdb7b4").then((res) => {
                            // Append the poster, title, and year to the DOM
                            document.getElementById("movies-collections-container").innerHTML +=
                                `
                            <div class="movie-container">
                                <div class="movie-image">
                                    <img src=${res.data.Poster} alt="${res.data.Title} Poster">
                                </div>

                                <div class="movie-content">
                                    <div class="add-content-container">
                                        <div>
                                            <h2 class="movie-name">${res.data.Title}</h2>
                                            <p class="movie-release-date">Released: ${res.data.Year}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
                        })
                    })
                })
            })
    } else {
        // If the user is not logged in
        window.location.replace('../index.html')
    }
});

// Creating a new movies collection
const createNewCollection = () => {
    event.preventDefault();

    // Get the field values for the new collection name and description
    const newCollectionName = document.querySelector(".search-input").value
    const newCollectionDescription = document.querySelector(".description").value

    // Ref to the user's doc
    const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

    // If newCollectionName is already a key in the movies_collections object inside userDocRef, show an error
    userDocRef.get().then((doc) => {
        if (doc.data().movies_collections[newCollectionName]) {
            errorPopup(`${newCollectionName} is already a movies collection`)
            document.querySelector(".search-input").value = "";
            return
        } else {
            // Get the current timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            // Inside userDocRef, there is a movies_collections object. Add a new key-value pair to it, where the key is newUserCollectionName and the value is an empty array.
            userDocRef.set({
                movies_collections: {
                    // Need to put it in brackets because using ES6's "computer property" syntax
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
            })
        }
    })
}

document.querySelector("#newCollectionBtn").addEventListener("click", createNewCollection);