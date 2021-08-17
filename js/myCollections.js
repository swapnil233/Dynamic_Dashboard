// Import interactions
import {
    successPopup,
    errorPopup
} from "./modules/interactions.js"

auth.onAuthStateChanged((user) => {
    if (user) {
        // Get the movie collections
        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((doc) => {

                if (doc.data().movies_collections) {
                    // movies_collections reference
                    const moviesCollection = doc.data().movies_collections;

                    if (moviesCollection == "") {
                        console.log("no movies collections yet")
                        return
                    }

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
                } else {
                    return
                }
            })
    } else {
        // If the user is not logged in
        window.location.replace('../index.html')
    }
});

const createNewCollection = () => {
    event.preventDefault();
    const newCollectionName = document.querySelector(".search-input").value
    const userDocRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);

    // If newCollectionName is already a key in the movies_collections object inside userDocRef, show an error
    userDocRef.get().then((doc) => {
        if (doc.data().movies_collections[newCollectionName]) {
            errorPopup(`${newCollectionName} is already a movies collection`)
            document.querySelector(".new-collection-input").value = "";
            return
        } else {
            // Inside userDocRef, there is a movies_collections object. Add a new key-value pair to it, where the key is newUserCollectionName and the value is an empty array.
            userDocRef.set({
                movies_collections: {
                    [newCollectionName]: []
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