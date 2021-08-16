// Import interactions
import {
    successPopup,
    errorPopup
} from "./modules/interactions.js"

auth.onAuthStateChanged((user) => {
    if (user) {
        // Get the movie collections
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then((doc) => {
            // movies_collections reference
            const moviesCollection = doc.data().movies_collections;
            // console.log(moviesCollection);

            // For each movies collection
            Object.keys(moviesCollection).forEach(collection => {

                // Get each collection's movies 
                const collectionMovies = moviesCollection[collection]
                // console.log(collectionMovies[0].split("_")[1])
                // console.log(`${collection}: ${collectionMovies}`)

                // Append each movie into the DOM
                collectionMovies.forEach(movie => {

                    const movie_imdbID = movie.split("_")[0]
                    const movie_created_at = movie.split("_")[1]

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