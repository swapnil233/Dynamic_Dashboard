document.querySelector(".search-button").addEventListener("click", e => {
    e.preventDefault()

    // Get movie search
    let searchText = document.querySelector(".search-input").value;
    
    getMovies(searchText);
});

const getMovies = (searchText) => {
    axios.get('https://www.omdbapi.com/?s=' + searchText + '&apikey=56bdb7b4').then((res) => {

        // Sort the movies by release year
        const sortedMovies = res.data.Search.sort(sortByReleaseYearAscending);
        console.log(sortedMovies);

        // Clear the console
        console.log('');

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
                                <h2 class="movie-name">${sortedMovies[i].Title}</h2>
                                <p class="movie-release-date">Released: ${sortedMovies[i].Year}</p>
                            </div>
                        </div>
                        `
                }
            }
        }

        // Append output into the output div
        document.querySelector("#movies").innerHTML += output;

    }).catch((err) => {
        console.log(err)
    })
}

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