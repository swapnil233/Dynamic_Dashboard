# Dynamic_Dashboard
A dynamic dashboard that uses Google Firebase as its backend. I'll probably turn this dashboard into a larger web-app once user functionalities are implemented.

# TODOs:
- Let user create a brand new collection on the myCollections.html page
- Fix the fact that every time the user clicks on the + button, fetchMovies.js reads data from Firestore using an async/await function to retrieve user's collection's upon movies loaded up

- Show movie collections popup when + button pressed.
  1. User clicks on the + button
  2. Get the id of that button (imdbID), and store it in a variable
  3. Get the list of movie collections in users>{uid}>movies_collections
  4. Inject a DOM element to show the movies_collections items. Each will be a link with an id equal to the name of the item.
  5. When the movies_collections item is clicked, put the imdbID of that movie into the collection item that was clicked
