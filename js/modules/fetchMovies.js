document.querySelector(".search-button").addEventListener("click", e => {
    e.preventDefault()

    // Clear out the movies already showing
    document.querySelector("#movies").innerHTML = '';

    // Get movie search
    let searchText = document.querySelector(".search-input").value;

    getMovies(searchText);
});

const getMovies = (searchText) => {
    axios.get('http://www.omdbapi.com/?s='+ searchText + '&apikey=56bdb7b4').then((res) => {
        let movies = res.data.Search;
        console.log(res.data.Search)
        
        let output = ''

        for (let i = 0; i<movies.length; i++) {
            console.log(res.data.Search[i].Title)

            output += `
                <div class="movie-container-wrapper">
                    <div class="movie-image-container">
                        <img src=${movies[i].Poster}>
                    </div>

                    <div class="movie-info-container">
                        <h5>${movies[i].Title}</h5>
                    </div>
                </div>
            `
        }

        document.querySelector("#movies").innerHTML = output;
    }).catch((err) => {
        console.log(err)
    })
}