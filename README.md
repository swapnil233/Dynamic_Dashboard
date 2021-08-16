
# Movie Collections Dashboard 
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
- Let user create a brand new collection on the myCollections.html page
- Fix the fact that every time the user clicks on the + button, fetchMovies.js reads data from Firestore using an async/await function to retrieve user's collection's upon movies loaded up

- Show movie collections popup when + button pressed.
  1. User clicks on the + button
  2. Get the id of that button (imdbID), and store it in a variable
  3. Get the list of movie collections in users>{uid}>movies_collections
  4. Inject a DOM element to show the movies_collections items. Each will be a link with an id equal to the name of the item.
  5. When the movies_collections item is clicked, put the imdbID of that movie into the collection item that was clicked

# Showcase:
![Login Page](https://imgur.com/3a8RQTr)
