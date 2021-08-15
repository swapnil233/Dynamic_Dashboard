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
            console.log(moviesCollection);

            // For each movies collection
            Object.keys(moviesCollection).forEach(collection => {

                // Get each collection's movies 
                const collectionMovies = moviesCollection[collection]
                console.log(`${collection}: ${collectionMovies}`)

                // Append the collection's name to the top
                document.querySelector("#movies-collections-container").innerHTML += `<h3>${collection}</h3>`

                // Append each movie into the DOM
                collectionMovies.forEach(movie => {
                    // Get movie's details
                    axios.get("http://www.omdbapi.com/?i=" + movie + "&apikey=56bdb7b4").then((res) => {
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

            // Using for loops, iterate through each collection and append the collection's name to the top
            for (var i = 0; i < Object.keys(moviesCollection).length; i++) {
                document.querySelector("#movies-collections-container").innerHTML += `<h3>${Object.keys(moviesCollection)[i]}</h3>`
            }
        })
    } else {
        // If the user is not logged in
        window.location.replace('../index.html')
    }
});