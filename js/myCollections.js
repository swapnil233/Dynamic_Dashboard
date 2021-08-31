// Import interactions
import {
    successPopup,
    errorPopup
} from "./modules/interactions.js"

// Import user functionalities
import {
    createNewCollection
} from './modules/userUpdates.js'

// Global variable to store the movies_collections object
var movies_collections_object;

// While user is authenticated
auth.onAuthStateChanged((user) => {
    if (user) {

        // Get the ref to the user doc
        const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

        // Get the movie collections
        userDocRef
            .get()
            .then((doc) => {

                // If a "movies_collections" object doesn't exist, create it.
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

                // Global assignment of movies_collections object
                movies_collections_object = movies_collections;

                // If the user has any collections, show the "All" option in the filter options
                if (Object.keys(movies_collections).length >= 1) {
                    // Add the name of each collection_name to the existing collections div
                    document.querySelector(".existing-collections").innerHTML +=
                        `
                <div class="collection-name-container active">
                    <p class="collection-name">
                        All
                    </p>
                </div>
                `
                }

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
                    movies_array.forEach(movie_imdbID => {

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

// Create a new movies collection when the user clicks the "Create" button
document.querySelector("#newCollectionBtn").addEventListener("click", createNewCollection);

// Movie Insertion Helper Functions to add movies to the page sequentially instead of paralell
const addMovieElementToContainerForID = (movie_imdbID) => {
    document.getElementById("movies-collections-container").innerHTML +=
        `<div class="movie-container movie_${movie_imdbID}" id="movie_${movie_imdbID}"></div>`;
}

// Update the movie element with the movie's data
const updateMovieElement = (movie_imdbID, collection_name, res) => {
    let movieContainerElement = document.getElementsByClassName(`movie_${movie_imdbID}`);

    // Iterate through the movieContainerElement array and for each element, update the movie element
    for (let i = 0; i < movieContainerElement.length; i++) {
        movieContainerElement[i].innerHTML =
        `
        <div class="movie-image">
            <img src=${res.data.Poster} alt="${res.data.Title} Poster" class="skeleton">
        </div>

        <div class="movie-content" data-imdbid="${movie_imdbID}">
            <div class="add-content-container">
                <div>
                    <h2 class="movie-name">${res.data.Title} | <span class="light">${collection_name}</span></h2>
                    <p class="movie-release-date">Released: ${res.data.Year}</p>
                </div>
                
                <span 
                class="material-icons no-overflow icon" 
                data-imdbid="${movie_imdbID}" 
                data-fromcollection="${collection_name.replace(/\s+/g, ' ').trim()}" 
                style="color:#f55757"">delete</span>
            </div>
        </div>
    `
    }
}

// Function that filters the global movies_collections_object 
const filterMovies = (movies_collections_object, filterBy) => {
    for (let key in movies_collections_object) {
        if (key === filterBy) {
            return movies_collections_object[key];
        }
    }
}

// Show filtered movies on the DOM when filter option clicked
document.querySelector(".existing-collections").addEventListener("click", (event) => {
    if (event.target.classList.contains("collection-name-container") || event.target.classList.contains("collection-name")) {
        const collection_name = event.target.textContent.replace(/\s+/g, ' ').trim();
        const collection = filterMovies(movies_collections_object, collection_name);

        // Add the "active" class to the clicked collection name after removing it from all other instances
        document.querySelectorAll(".collection-name-container").forEach(collection_name_container => {
            collection_name_container.classList.remove("active");
        })
        if (event.target.classList.contains("collection-name-container")) {
            event.target.classList.add("active");
        } else if (event.target.classList.contains("collection-name")) {
            event.target.parentElement.classList.add("active");
        }

        // Empty the movies-collections-container div
        document.getElementById("movies-collections-container").innerHTML = '';

        // If collection_name === "All", show all the movies inside movies_collections_object
        if (collection_name === "All") {
            Object.keys(movies_collections_object).forEach(collection_name => {
                const collection = movies_collections_object[collection_name];
                collection.movies.forEach(movie_imdbID => {
                    addMovieElementToContainerForID(movie_imdbID);
                    axios.get("https://www.omdbapi.com/?i=" + movie_imdbID + "&apikey=56bdb7b4").then((res) => {
                        updateMovieElement(movie_imdbID, collection_name, res)
                    })
                })
            })
        } else {
            // For each imdbID inside collection -> movies array, add the movie to the movies-collections-container div
            collection.movies.forEach(movie => {
                let movie_imdbID = movie.split("_")[0];
                addMovieElementToContainerForID(movie_imdbID);
                axios.get("https://www.omdbapi.com/?i=" + movie_imdbID + "&apikey=56bdb7b4").then((res) => {
                    updateMovieElement(movie_imdbID, collection_name, res)
                })
            })
        }
    }
})

// Delete a movie from a collection
document.querySelector(".collections-container").addEventListener("click", (e) => {
    if (e.target.classList.contains("icon")) {

        const imdbID = e.target.dataset.imdbid;
        const collectionName = e.target.dataset.fromcollection;
        const movieName = e.target.parentElement.querySelector(".movie-name").textContent;

        // Get the user's doc ref
        const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

        // Go to the collection name
        userDocRef.get().then((doc) => {
            const collection_ref_in_firebase = doc.data().movies_collections[collectionName].movies;

            for (let i in collection_ref_in_firebase) {
                if (collection_ref_in_firebase[i].split("_")[0] === imdbID) {
                    console.log("Deleting: " + collection_ref_in_firebase[i] + " from " + collectionName);

                    // Index of collection_ref_in_firebase[i] inside doc.data().movies_collections[collectionName].movies.collectionName
                    const index = doc.data().movies_collections[collectionName].movies.indexOf(collection_ref_in_firebase[i]);

                    // Remove that one from the collection inside firebase
                    userDocRef.update({
                        [`movies_collections.${collectionName}.movies`]: firebase.firestore.FieldValue.arrayRemove(collection_ref_in_firebase[i])
                    }).then(() => {
                        // Remove the movie from the DOM
                        document.getElementById(`movie_${imdbID}`).remove();
                        successPopup(`Removed ${movieName} from ${collectionName}`)
                    })
                }
            }
        })
    }
})