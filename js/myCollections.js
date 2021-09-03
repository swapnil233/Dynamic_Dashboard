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
                            updateMovieElement(movie_imdbID, collection_name, res, false);
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
        `<div 
            class="movie-container movie_${movie_imdbID}" 
            id="movie_${movie_imdbID}">
        </div>`;
}

// Update the movie element with the movie's data
const updateMovieElement = (movie_imdbID, collection_name, res, is_filtered) => {
    const movieContainerElements = document.getElementsByClassName(`movie_${movie_imdbID}`);

    // Iterate through the movieContainerElements array and for each element, update the movie element
    for (let i = 0; i < movieContainerElements.length; i++) {

        if (is_filtered) {
            movieContainerElements[i].innerHTML =
                `
            <div class="movie-image">
                <img src=${res.data.Poster} alt="${res.data.Title} Poster" class="skeleton">
            </div>

            <div class="movie-content" data-imdbid="${movie_imdbID}">
                <div class="add-content-container">
                    <div>
                        <h2 class="movie-name">${res.data.Title}</h2>
                        <p class="movie-release-date">Released: ${res.data.Year}</p>
                    </div>
                    
                    <span 
                    class="material-icons no-overflow icon" 
                    data-imdbid="${movie_imdbID}" 
                    data-fromcollection="${collection_name.replace(/\s+/g, ' ').trim()}" 
                    style="color:#f55757; overflow:inherit;">delete
                    </span>
                </div>
            </div>
            `
        } else {

            movieContainerElements[i].innerHTML =
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
                        style="color:#f55757; overflow:inherit;">delete
                        </span>
                    </div>
                </div>
                `
        }
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

// Filter by clicked collection name
document.querySelector(".existing-collections").addEventListener("click", (event) => {

    // If clicked on collection name or collection name's container
    if (event.target.classList.contains("collection-name-container") || event.target.classList.contains("collection-name")) {
        const collection_name = event.target.textContent.replace(/\s+/g, ' ').trim();
        const collection = filterMovies(movies_collections_object, collection_name);

        // Remove the active class from all collection name containers
        document.querySelectorAll(".collection-name-container").forEach(collection_name_container => {
            collection_name_container.classList.remove("active");
        })

        // Add the active class to the clicked collection name container
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
                        updateMovieElement(movie_imdbID, collection_name, res, false);
                    })
                })
            })
        } else {
            // For each imdbID inside collection -> movies array, add the movie to the movies-collections-container div
            collection.movies.forEach(movie => {
                let movie_imdbID = movie.split("_")[0];
                addMovieElementToContainerForID(movie_imdbID);
                axios.get("https://www.omdbapi.com/?i=" + movie_imdbID + "&apikey=56bdb7b4").then((res) => {
                    updateMovieElement(movie_imdbID, collection_name, res, true)
                })
            })
        }
    }
})

// Delete a movie from a collection
document.querySelector(".collections-container").addEventListener("click", (e) => {
    e.preventDefault();
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
                        console.log("Removed " + collection_ref_in_firebase[i] + " from " + collectionName);
                    })
                }
            }
        })
    }
})

// Edit collections
document.querySelectorAll("#edit-collections-btn").forEach(edit_collections_btn => {
    edit_collections_btn.addEventListener("click", (e) => {
        e.preventDefault();

        // If the div with the class "dropdown-content" has the class "show", remove it
        if (document.querySelector(".dropdown-content").classList.contains("show")) {
            document.querySelector(".dropdown-content").classList.remove("show");
        }

        // Show the add to collection popup
        document.querySelector(".collections-modal").classList.toggle("hidden");

        // Get the user's doc ref
        const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

        // Get the user's collections
        userDocRef.get().then((doc) => {
            const user_collections = doc.data().movies_collections;

            // For each collection name, add it to the collections-modal
            Object.keys(user_collections).forEach(collection_name => {
                document.querySelector(".collections-modal-collections").innerHTML +=
                    `
            <div class="collection-wrapper">
                <h3 class="collection-name">${collection_name}</h3>
                <span 
                class="material-icons icon collection-button" 
                id="${collection_name}"
                style="margin-left: 30px">delete</span>
            </div>
            `
            })
        })
    })
})

// Add an event listener to the 'Edit Collections' modal/popup
document.querySelector(".collections-modal ").addEventListener("click", (e) => {

    // When a collection's delete button is clicked, delete the collection
    if (e.target.classList.contains("collection-button")) {

        // Collection name -- get rid of whitespace before and after
        const clicked_movies_collection_name = e.target.parentElement.children[0].textContent.replace(/\s+/g, ' ').trim();

        // User's doc ref.
        var user_doc_ref = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)

        // push into the doc ref "movies_collections" object
        user_doc_ref.update({
            [`movies_collections.${clicked_movies_collection_name}`]: firebase.firestore.FieldValue.delete()
        }).then(() => {
            successPopup(`Deleted <span style="font-weight:bold;">${clicked_movies_collection_name}</span>`)
            // Remove the collection from the DOM
            e.target.parentElement.remove();

            // Remove that collection from filter list
            document.querySelectorAll(".collection-name").forEach(collection_name => {
                if (collection_name.textContent.replace(/\s+/g, ' ').trim() === clicked_movies_collection_name) {
                    collection_name.parentElement.remove();
                }
            })

            // Remove that collection from the global variable
            delete movies_collections_object[clicked_movies_collection_name];

            // Remove the movies of that collection from the DOM
            document.querySelectorAll(".light").forEach(span => {
                if (span.textContent === clicked_movies_collection_name) {
                    span.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
                }
            })
        }).catch((err) => {
            errorPopup(`Couldn't delete <span style="font-weight:bold;">${clicked_movies_collection_name}</span>`)
        })
    }
})

// Close the edit collections modal when the 'X' is clicked
document.querySelector("#close-collections-modal").addEventListener("click", () => {
    document.querySelector(".collections-modal").classList.toggle("hidden");
    document.querySelector(".collections-modal-collections").innerHTML = "";
});