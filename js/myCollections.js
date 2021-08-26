// Import interactions
import {
    successPopup,
    errorPopup
} from "./modules/interactions.js"

// While user is authenticated
auth.onAuthStateChanged((user) => {
    if (user) {

        // Get the ref to the user doc
        const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

        // Get the movie collections
        userDocRef
            .get()
            .then((doc) => {

                // If a "movies_collections" object doesn't exist, create it. This shouldn't ever be the case as it's created upon signup, but just in case.
                if (!doc.data().movies_collections) {
                    userDocRef.set({
                        movies_collections: {}
                    }, {
                        merge: true
                    })
                    return
                }

                // movies_collections ref
                const movies_collections = doc.data().movies_collections;

                // For each movies_collections key
                Object.keys(movies_collections).forEach(collection_name => {

                    // Add the name of each collection_name to the existing collections div
                    document.querySelector(".existing-collections").innerHTML +=
                    `
                    <div class="collection-name-container">
                        <p class="collection-name">
                            ${collection_name}
                        </p>
                    </div>
                    `

                    // Get movies_collections -> {collection_name} -> movies array
                    const movies_array = movies_collections[collection_name].movies;

                    // For each imdbID inside movies_collections -> {collection_name} -> movies array
                    movies_array.forEach(movie => {

                        // Get the imdbID
                        let movie_imdbID = movie.split("_")[0];

                        addMovieElementToContainerForID(movie_imdbID);

                        axios.get("https://www.omdbapi.com/?i=" + movie_imdbID + "&apikey=56bdb7b4").then((res) => {
                            updateMovieElement(movie_imdbID, collection_name, res)
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
            document.querySelector(".description").value = "";
            return
        } else {
            // Get the current timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();

            // Inside userDocRef, there is a movies_collections object. Add a new key-value pair to it, where the key is newUserCollectionName and the value is an empty array.

            document.querySelector(".existing-collections").innerHTML = '';

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
            })
        }
    })
}

document.querySelector("#newCollectionBtn").addEventListener("click", createNewCollection);


// Movie Insertion Helper Functions to add movies to the page sequentially instead of paralell
const addMovieElementToContainerForID = (movie_imdbID) => {
    document.getElementById("movies-collections-container").innerHTML +=
        `<div class="movie-container" id="movie_${movie_imdbID}"></div>`;
}
const updateMovieElement = (movie_imdbID, collection_name, res) => {
    let movieContainerElement = document.getElementById(`movie_${movie_imdbID}`);
    movieContainerElement.innerHTML =
        `
        <div class="movie-image">
            <img src=${res.data.Poster} alt="${res.data.Title} Poster" class="skeleton">
        </div>

        <div class="movie-content" data-imdbid="${collection_name.replace(/\s+/g, ' ').trim()}">
            <div class="add-content-container">
                <div>
                    <h2 class="movie-name">${res.data.Title}</h2>
                    <p class="movie-release-date">Released: ${res.data.Year}</p>
                </div>
                <div class="movies-options">
                    
                </div>
            </div>
        </div>
    `;
}