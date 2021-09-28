// Import interactions
import {
    successPopup,
    errorPopup,
    startLoadingAnimation,
    endLoadingAnimation
} from './interactions.js';

// Import new collection name error checking
import {
    newCollectionNameErrorChecks
} from './userUpdates.js';

// Global variable to store the movies_collections object
var movies_collections_object;

// When the search button is clicked
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
    startLoadingAnimation(document.querySelector(".search-button"), document.querySelector(".search-loader"), document.querySelector(".search-btn-text"));

    axios.get('https://www.omdbapi.com/?s=' + searchText + '&apikey=56bdb7b4')
        .then((res) => {

            // Sort the movies by release year
            const sortedMovies = res.data.Search.sort(sortByReleaseYearAscending);

            // Empty the output div
            document.querySelector("#movies").innerHTML = '';

            // Loop through the movies and add them to the output
            for (let i = 0; i < sortedMovies.length; i++) {

                // If movie or tv show
                if (sortedMovies[i].Type === "movie" || sortedMovies[i].Type == "series") {

                    // If it has an image
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

            // End loading animation
            endLoadingAnimation(document.querySelector(".search-button"), document.querySelector(".search-loader"), document.querySelector(".search-btn-text"));

        }).catch(() => {
            // End loading animation
            endLoadingAnimation(document.querySelector(".search-button"), document.querySelector(".search-loader"), document.querySelector(".search-btn-text"));

            // Display error 
            errorPopup("The entry was not found", 5000);
        });
}

// Event listener on the entire element that holds the displayed movies

document.querySelector("#movies").addEventListener("click", (e) => {

    // If + is clicked
    if (e.target.id[0] === "t") {

        // Movie imdbID
        const movieID = e.target.id;

        // Movie title
        const movieTitle = e.target.parentElement.parentElement.children[0].children[0].innerText;

        // Movie poster image
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

                // Store the object in the global variable "movies_collections_object"
                movies_collections_object = moviesCollection;

                // Show the "add to collection" popup modal
                document.querySelector(".collections-modal").classList.toggle("hidden");

                // Show the movie's poster in the popup modal
                document.querySelector("#current-movie-poster").src = moviePoster;
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

                // Show all the collections inside the "Add to collections" popup modal
                Object.keys(moviesCollection).forEach(collection => {

                    // Collection name
                    const collectionName = collection.replace(/\s+/g, ' ').trim();

                    // Push the collection names to the popup modal
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
                                >add
                            </span>
                        </div>
                        `
                })

                // If the movie is already inside one of the collections, show a green checkmark and disable the button
                document.querySelectorAll(".collection-button").forEach(collection => {
                    if (movies_collections_object[collection.id].movies.includes(movieID)) {
                        collection.innerHTML = "check";
                        collection.style.color = "green";
                        collection.dataset.active = "false";
                        collection.style.cursor = "default";
                    }
                })
            })
    }
});

// Add an event listener to the 'Add to Collection' modal/popup
document.querySelector(".collections-modal ").addEventListener("click", (e) => {

    // When the + is clicked beside a collection
    if (e.target.classList.contains("collection-button") && e.target.dataset.active === "true") {

        // Collection name
        const collectionName = e.target.parentElement.children[0].textContent.replace(/\s+/g, ' ').trim();

        // Movie imdbID.
        const imdbID = e.target.dataset.imdbid;

        // Movie Name
        const movieName = e.target.dataset.title;

        // User's doc ref.
        var user_doc_ref = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)

        // push into the doc ref "movies_collections" object
        user_doc_ref.update({
            [`movies_collections.${collectionName}.movies`]: firebase.firestore.FieldValue.arrayUnion(imdbID)
        }).then(() => {
            successPopup(`Added ${movieName} to your ${collectionName} collection`)

            // Change the icon from plus sign to green checkmark and disable the button
            e.target.textContent = "check"
            e.target.style.color = "green"
            e.target.dataset.active = "false";
        }).catch((err) => {
            errorPopup(`Couldn't add ${movieName} to your ${collectionName} collection. Please try again`, 5000)
        })
    }

    // When the 'Create new collection' button is clicked (which is only visible if the user has no collections)
    if (e.target.id === "create-first-collection-btn") {
        e.preventDefault();

        // imdbID
        const movieID = e.target.dataset.imdbid;

        // Movie Name.
        const movieTitle = e.target.dataset.title;

        // Get the collection name
        const collectionName = document.querySelector("#create-collection-name").value;

        // Check if the collection name is valid
        newCollectionNameErrorChecks(collectionName);

        // User's doc ref.
        var user_doc_ref = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)

        // If the new collection name is valid
        if (newCollectionNameErrorChecks(collectionName)) {

            // If collectionName is already a key in the movies_collections object inside user_doc_ref, show an error
            user_doc_ref.get().then((doc) => {
                if (doc.data().movies_collections[collectionName]) {
                    errorPopup(`${collectionName} is already a collection`, 5000)
                    document.querySelector("#create-collection-name").value = "";
                    return
                } else {
                    // Get the current timestamp
                    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

                    // Create new collection inside movies_collections
                    user_doc_ref.set({
                        movies_collections: {
                            // Need to put it in brackets because using ES6's "computed property" syntax
                            [collectionName]: {
                                dateCreated: timestamp,
                                createdBy: firebase.auth().currentUser.email,
                                movies: []
                            }
                        }
                    }, {
                        merge: true
                    }).then(() => {
                        // Show success popup
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
                    })
                }
            })
        }
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