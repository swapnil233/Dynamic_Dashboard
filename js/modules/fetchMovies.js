document.querySelector(".search-button").addEventListener("click", e => {
    e.preventDefault()

    // Clear out the movies already showing
    document.querySelector("#movies").innerHTML = '';

    // Get movie search
    let searchText = document.querySelector(".search-input").value;

    getMovies(searchText);
});

const getMovies = (searchText) => {
    axios.get('https://www.omdbapi.com/?s='+ searchText + '&apikey=56bdb7b4').then((res) => {
        let movies = res.data.Search;
        console.clear()
        console.log(movies)
        
        let output = ''

        for (let i = 0; i<movies.length; i++) {
            console.log(movies[i].Title)

            if (movies[i].Type==="movie" || movies[i].Type=="series"){
                output += 
                `
                <div class="movie-container">
                    <div class="movie-image">
                        <img src=${movies[i].Poster} alt="${movies[i].Title} Poster">
                    </div>
                    <div class="movie-content">
                        <h2 class="movie-name">${movies[i].Title}</h2>
                        <p class="movie-release-date">Released: ${movies[i].Year}</p>
                    </div>
                </div>
                `
            }
        }

        document.querySelector("#movies").innerHTML = output;
    }).catch((err) => {
        console.log(err)
    })
}