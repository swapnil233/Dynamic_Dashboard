// Import interactions
import {
    successPopup,
    errorPopup,
    startLoadingAnimation,
    endLoadingAnimation
} from './interactions.js';

document.querySelector(".search-button").addEventListener("click", e => {
    e.preventDefault()

    // Get movie search
    let searchText = document.querySelector(".search-input").value;

    displayMovies(searchText);
});

// Get the movies from the API
const displayMovies = (searchText) => {

    // Start loading animation
    startLoadingAnimation(
        // Button element
        document.querySelector(".search-button"),

        // Loader element
        document.querySelector(".search-loader"),

        // Button Text Element
        document.querySelector(".search-btn-text")
    );

    axios.get('https://www.omdbapi.com/?s=' + searchText + '&apikey=56bdb7b4')
        .then((res) => {

            // Clear the console
            console.clear();

            // Sort the movies by release year
            const sortedMovies = res.data.Search.sort(sortByReleaseYearAscending);

            // Empty the output div
            document.querySelector("#movies").innerHTML = '';
            let output = ''

            // Loop through the movies and add them to the output
            for (let i = 0; i < sortedMovies.length; i++) {

                // If sortedMovies[i] is a movie or a series, add it to the output
                if (sortedMovies[i].Type === "movie" || sortedMovies[i].Type == "series") {
                    // If sortedMovies[i] has an image
                    if (sortedMovies[i].Poster !== "N/A") {

                        output +=
                            `
                        <div class="movie-container">
                            <div class="movie-image">
                                <img src=${sortedMovies[i].Poster} alt="${sortedMovies[i].Title} Poster">
                            </div>

                            <div class="movie-content">
                                <div class="add-content-container">
                                    <div>
                                        <h2 class="movie-name">${sortedMovies[i].Title}</h2>
                                        <p class="movie-release-date">Released: ${sortedMovies[i].Year}</p>
                                    </div>

                                    <div class="add-to-collection">
                                        <span class="material-icons icon" id=${sortedMovies[i].imdbID}>add</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    }
                }
            }

            // Append output into the output div
            document.querySelector("#movies").innerHTML += output;

            // End loading animation
            endLoadingAnimation(
                // Button element
                document.querySelector(".search-button"),

                // Loader element
                document.querySelector(".search-loader"),

                // Button Text Element
                document.querySelector(".search-btn-text")
            );

        }).catch(() => {
            // End loading animation
            endLoadingAnimation(
                // Button element
                document.querySelector(".search-button"),

                // Loader element
                document.querySelector(".search-loader"),

                // Button Text Element
                document.querySelector(".search-btn-text")
            );

            errorPopup("The entry was not found");
        });
}

// Using event delegation, add an event listener to the parent element of each movie's + button

document.querySelector("#movies").addEventListener("click", (e) => {
    e.preventDefault();

    // Show available movies collections when + is clicked
    if (e.target.id[0] === "t") {
        // Get the movie's imdbID
        const movieID = e.target.id;

        // If the target's parent's parent's parent contains a "collection-container" element, don't add it again
        if (e.target.parentElement.parentElement.parentElement.querySelector(".collection-container") === null) {
            // Get the available movie collections
            firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then((doc) => {
                    // "movies_collections" object from Firestore
                    const moviesCollection = doc.data().movies_collections

                    // Append user's movies_collections titles (the keys)
                    Object.keys(moviesCollection).forEach(collection => {

                        // Collection name -- get rid of whitespace before and after
                        const collectionName = collection.replace(/\s+/g, ' ').trim();

                        // Add each key to the innerHTML of the "Add to Collection" button's parent element
                        document.getElementById(movieID).parentElement.parentElement.parentElement.innerHTML +=
                            `
                            <br>
                            <div class="collection-container">
                                <a class="collection-button" id="${collectionName}" data-imdbID="${movieID}" href="#">
                                    ${collectionName}
                                </a>
                            </div>
                            `
                    })
                })
        } else {
            errorPopup("Already Open");
        }
    }

    // When a movie collection name is clicked, add the movie it's under to the collection
    if (e.target.className === "collection-button") {

        // Collection name -- get rid of whitespace before and after
        const clicked_movies_collection_name = e.target.textContent.replace(/\s+/g, ' ').trim();

        // Current timestamp
        const timestamp = new Date().toISOString();

        // Movie's imdbID.
        const clicked_movie_imdbID = e.target.dataset.imdbid + "_" + timestamp;

        // Movie Name.
        const movieName = e.target.parentElement.parentElement.children[0].children[0].children[0].innerHTML;

        // User's doc ref.
        var user_doc_ref = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)

        // push into the doc ref "movies_collections" object
        user_doc_ref.update({
            [`movies_collections.${clicked_movies_collection_name}.movies`]: firebase.firestore.FieldValue.arrayUnion(clicked_movie_imdbID)
        }).then(() => {
            successPopup(`Added ${movieName} to your ${clicked_movies_collection_name} collection`)
        }).catch((err) => {
            errorPopup(`Couldn't add ${movieName} to your ${clicked_movies_collection_name} collection`)
        })
    }
});

// Function that sorts the movies array by "Year", descending
function sortByReleaseYearDescending(a, b) {
    if (a.Year < b.Year) return 1;
    if (a.Year > b.Year) return -1;
    return 0;
}

// Function that sorts the movies array by "Year", ascending
function sortByReleaseYearAscending(a, b) {
    if (a.Year < b.Year) return -1;
    if (a.Year > b.Year) return 1;
    return 0;
}