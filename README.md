
# Movie Collections Dashboard 

The site is live! Check it out at https://filmlist.ca

This is a web app created entirely in vanilla HTML5, CSS3 and JavaScript utilizing ES6 features for the front-end, and Firebase's Auth, Firestore and Storage for the back-end.

In this website, users can:
1. Sign up
2. Log in
3. Reset their password
4. Once logged in, update their profile information, including:
	a. Username
	b. Biography
	c. Display Picture
5. Verify their email addresse
6. Search up movies and TV shows
7. Create new movie collections
8. Add movies to their movie collections
9. Delete entire collections
10. Delete individual movies from collections 

The website is also secure from unauthorized access, which is done using Firebase security rules.

Movies are fetched using the [Open Movie Database (OMD)](https://www.omdbapi.com/) and Axios, and hosted on Netlify.

I'll post the website link once it's finished.

# TODOs:
- Let users filter their search by movies, series or episodes using the OMDB API param 'type' in the search page
- Optimize showing movies_collections by storing them in a global variable in the beginning of the page load and then just show them when the user clicks on the "Add to Collection" button (or the + button) -- this way, the user doesn't have to wait for the page to load to see the collections and it reduces the amount of data that needs to be fetched from Firestore
- Before adding a movie to the collection, check if its imdbID exists & show error if so.
- Delete & rename existing collections
- Re-design profile updating modal

# Future: 
- Movies collections pagination
- Movies search pagination
- Randomized movies search on home page

# Showcase:
![Imgur](https://imgur.com/R0Ytz2N.png)

![Imgur](https://imgur.com/QFCCPX2.png)

![Imgur](https://imgur.com/e2ZOWb6.png)

![Imgur](https://imgur.com/Z4G6i1T)

![Imgur](https://imgur.com/Esi0y4a)

![Imgur](https://imgur.com/A4ZcfKz)

![Imgur](https://imgur.com/rngSrlZ)

![Imgur](https://imgur.com/rsA6OjT)
