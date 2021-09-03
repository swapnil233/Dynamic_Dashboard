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

    // If there are spaces before or after the search text, remove them
    searchText = searchText.trim();

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

                        document.querySelector("#movies").innerHTML +=
                            `
                        <div class="movie-container">
                            <div class="movie-image">
                                <img src=${sortedMovies[i].Poster} alt="${sortedMovies[i].Title} Poster Image" class="skeleton">
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
            // document.querySelector("#movies").innerHTML += output;

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

        // Get the movie's title
        const movieTitle = e.target.parentElement.parentElement.children[0].children[0].innerText;

        // Get the movie's poster image url
        const moviePoster = e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[0].src;

        // Get the available movie collections
        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((doc) => {
                // "movies_collections" object from Firestore
                const moviesCollection = doc.data().movies_collections

                // Show the add to collection popup
                document.querySelector(".collections-modal").classList.toggle("hidden");

                // Set the current movie poster image
                document.querySelector("#current-movie-poster").src = moviePoster;

                // Set the current movie poster's alt text
                document.querySelector("#current-movie-poster").alt = movieTitle + " Poster Image";

                // If the user does not have any collections, give them an option to create one
                if (Object.keys(moviesCollection).length === 0) {
                    document.querySelector(".collections-modal-collections").innerHTML =
                        `
                    <div class="create-new-collection-form" style="width: 100%;">
                        <input type="text" id="create-collection-name" placeholder="Create your first collection">
                        <button class="create-collection-btn" id="create-first-collection-btn" type="submit" data-imdbID="${movieID}"
                        data-title="${movieTitle}">Create</button>
                    </div>
                    `
                }

                // Append user's movies_collections titles (the keys)
                Object.keys(moviesCollection).forEach(collection => {

                    // Collection name -- get rid of whitespace before and after
                    const collectionName = collection.replace(/\s+/g, ' ').trim();

                    // Add all the available collections as DOM elements inside .collections-modal-collections
                    document.querySelector(".collections-modal-collections").innerHTML +=
                        `
                        <div class="collection-wrapper">
                            <h3 class="collection-name">${collectionName}</h3>
                            <span 
                                class="material-icons icon collection-button" 
                                id="${collectionName}" 
                                data-imdbID="${movieID}"
                                data-title="${movieTitle}"
                                data-active="true"
                                style="margin-left: 30px"
                                >add</span>
                        </div>
                        `
                })
            })
    }
});

// Add an event listener to the 'Add to Collection' modal/popup
document.querySelector(".collections-modal ").addEventListener("click", (e) => {

    // When a movie collection name is clicked, add the movie it's under to the collection
    if (e.target.classList.contains("collection-button") && e.target.dataset.active === "true") {
        console.log(e.target.id);

        // Collection name
        const clicked_movies_collection_name = e.target.parentElement.children[0].textContent.replace(/\s+/g, ' ').trim();

        // Movie's imdbID.
        const clicked_movie_imdbID = e.target.dataset.imdbid;

        // Movie Name.
        const movieName = e.target.dataset.title;

        // User's doc ref.
        var user_doc_ref = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)

        // push into the doc ref "movies_collections" object
        user_doc_ref.update({
            [`movies_collections.${clicked_movies_collection_name}.movies`]: firebase.firestore.FieldValue.arrayUnion(clicked_movie_imdbID)
        }).then(() => {
            successPopup(`Added ${movieName} to your ${clicked_movies_collection_name} collection`)
            // Change the icon from plus sign to green checkmark
            e.target.textContent = "check"
            e.target.style.color = "green"

            // Disable e.target (the add to collection button)
            e.target.dataset.active = "false";
        }).catch((err) => {
            errorPopup(`Couldn't add ${movieName} to your ${clicked_movies_collection_name} collection`)
        })
    }

    // If e.target is the 'Create Collection' button
    if (e.target.id === "create-first-collection-btn") {
        e.preventDefault();

        // imdbID
        const movieID = e.target.dataset.imdbid;

        // Movie Name.
        const movieTitle = e.target.dataset.title;

        // Get the collection name
        const collectionName = document.querySelector("#create-collection-name").value;
        console.log(collectionName);

        // User's doc ref.
        var user_doc_ref = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)

        // push into the doc ref "movies_collections" object
        user_doc_ref.update({
            [`movies_collections.${collectionName}`]: {
                movies: []
            }
        }).then(() => {
            successPopup(`Created ${collectionName} collection`)
            // Clear out the box
            document.querySelector(".collections-modal-collections").innerHTML = "";

            // Replace it with the newly created collection
            document.querySelector(".collections-modal-collections").innerHTML +=
            `
            <div class="collection-wrapper">
                <h3 class="collection-name">${collectionName}</h3>
                <span 
                    class="material-icons icon collection-button" 
                    id="${collectionName}" 
                    data-imdbID="${movieID}"
                    data-title="${movieTitle}"
                    data-active="true"
                    style="margin-left: 30px"
                    >add</span>
            </div>
            `

            // Add the movie to the newly created collection
            user_doc_ref.update({
                [`movies_collections.${collectionName}.movies`]: firebase.firestore.FieldValue.arrayUnion(movieID)
            }).then(() => {
                // Change the icon from plus sign to green checkmark
                document.querySelector(".collection-button").textContent = "check"
                document.querySelector(".collection-button").style.color = "green"
            })
        }).catch((err) => {
            errorPopup(`Couldn't create ${collectionName} collection`)
        })
    }
})

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

// Close the add to collection modal when the 'X' is clicked
document.querySelector("#close-collections-modal").addEventListener("click", () => {
    document.querySelector(".collections-modal").classList.toggle("hidden");
    document.querySelector(".collections-modal-collections").innerHTML = "";
});