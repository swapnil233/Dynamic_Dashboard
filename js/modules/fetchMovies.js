// Import interactions
import {
    successPopup,
    errorPopup
} from './interactions.js';

document.querySelector(".search-button").addEventListener("click", e => {
    e.preventDefault()

    // Get movie search
    let searchText = document.querySelector(".search-input").value;

    displayMovies(searchText);
});

// Get the movies from the API
const displayMovies = (searchText) => {
    axios.get('https://www.omdbapi.com/?s=' + searchText + '&apikey=56bdb7b4')
        .then((res) => {

            // Clear the console
            console.clear();

            // Sort the movies by release year
            const sortedMovies = res.data.Search.sort(sortByReleaseYearAscending);
            console.log(sortedMovies);

            // Empty the output div
            document.querySelector("#movies").innerHTML = '';
            let output = ''

            // Loop through the movies and add them to the output
            for (let i = 0; i < sortedMovies.length; i++) {
                console.log(sortedMovies[i].Title)
                console.log(sortedMovies[i].imdbID)

                // Get full details of the movies 
                // axios.get("http://www.omdbapi.com/?i=" + sortedMovies[i].imdbID + "&apikey=56bdb7b4").then((res) => {
                //     console.log(res.data);
                // })

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
        }).catch(() => {
            errorPopup("The entry was not found");
        });
}

// Using event delegation, add an event listener to the parent element

// When a movie's "Add to Collection" link is clicked, show the available collections to add the movie to inside the "Add to Collection" button's parent element.
document.querySelector("#movies").addEventListener("click", (e) => {
    e.preventDefault();

    // If e.target id is an imdbID
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
                    // Get a reference to the "movies_collections" collection, which is an object
                    const moviesCollection = doc.data().movies_collections

                    // Show user's movies collections
                    Object.keys(moviesCollection).forEach(collection => {

                        // Add each key to the innerHTML of the "Add to Collection" button's parent element
                        document.getElementById(movieID).parentElement.parentElement.parentElement.innerHTML +=
                            `
                            <br>
                            <div class="collection-container">
                                <a class="collection-button" id="${collection} ${movieID}" href="#">
                                    ${collection}
                                </a>
                            </div>
                            `
                    })
                })
        } else {
            errorPopup("Already Open");
        }
    }

    // When a movie collection is clicked, add the movie to the collection
    if (e.target.className === "collection-button") {

        // Get the ref to the movie collection name and the imdbID
        const clicked_movies_collection_name = e.target.id.split(" ")[0];
        const clicked_movie_imdbID = e.target.id.split(" ")[1];

        // Name of the movie
        const movieName = e.target.parentElement.parentElement.children[0].children[0].children[0].innerHTML;

        // test_array ref
        var user_doc_ref = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)

        // collection ref
        const collection = `movies_collections.${clicked_movies_collection_name}`

        // push into the doc
        user_doc_ref.update({
            [`movies_collections.${clicked_movies_collection_name}`]: firebase.firestore.FieldValue.arrayUnion(clicked_movie_imdbID)
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