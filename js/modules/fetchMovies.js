// Import the successPopup function and the errorPopup function from '../dashboard.js'
import {successPopup} from './popups.js'
import {errorPopup} from './popups.js'

document.querySelector(".search-button").addEventListener("click", e => {
    e.preventDefault()

    // Get movie search
    let searchText = document.querySelector(".search-input").value;

    getMovies(searchText);
});

const getMovies = (searchText) => {
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

                                    <a class="add-to-collection" href="#">
                                        <span class="material-icons icon" id=${sortedMovies[i].imdbID}>add</span>
                                    </a>
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
    })
}

// When a movie's "Add to Collection" link is clicked, return the movie's imdbID
document.querySelector("#movies").addEventListener("click", e => {
    e.preventDefault();
    getMovieClickedID(e);
});

// Get the imdbID of the movie that was clicked
const getMovieClickedID = (e) => {
    e.preventDefault();
    return e.target.id;
}

// Wheen a movie's "Add to Collection" link is clicked, append the available collections to add the movie to inside the "Add to Collection" button's parent element
document.querySelector("#movies").addEventListener("click", e => {
    e.preventDefault();
    const movieID = getMovieClickedID(e);

    // Get the available movie collections 
    firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(doc => {
            moviesCollection = doc.data().movies_collections
        })
        .then(() => {

            // Loop through each key in the moviesCollection object
            for (let i = 0; i < Object.keys(moviesCollection).length; i++) {
                console.log(Object.keys(moviesCollection)[i])

                // Add each key to the innerHTML of the "Add to Collection" button's parent element
                document.getElementById(movieID).parentElement.parentElement.parentElement.innerHTML +=
                    `
                <br>
                
                <a class="collection-button" id="${Object.keys(moviesCollection)[i]}">
                    ${Object.keys(moviesCollection)[i]}
                </a>
                `
            }
        })
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