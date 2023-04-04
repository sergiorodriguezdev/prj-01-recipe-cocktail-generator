



// This is used to set/get the list of favorites localStorage item
const LS_FAVORITES = "Favorites-List";

// Favorites HTML element
var favoritesEl = document.getElementById("favorites");

// Retrieve list of favorites from LocalStorage and create HTML
function loadFavorites() {

    // Remove all children nodes from favorites HTML element
    /*
        TBD
    */

    // Retrieve array of favorites from localStorage
    var listFavorites = JSON.parse(localStorage.getItem(LS_FAVORITES));

    // Check if list of favorites exists or is empty
    // If array is null, then save an empty array string to localStorage and stop function execution
    // If array is empty, stop function execution
    if (listFavorites === null) {
        listFavorites = [];
        localStorage.setItem(LS_FAVORITES, JSON.stringify(listFavorites));
        return;
    }
    else if (listFavorites.length === 0) {
        return;
    }

    // Loop through list of favorites and create individual HTML elements for each
    for (var i = 0; i < listFavorites.length; i++) {
        var favoriteItem = document.createElement("div");

        var favoriteIcon = document.createElement("img");

        var favoriteName = document.createElement("h3");
        favoriteName.textContent = listFavorites[i].name;

        var favoriteRemoveButton = document.createElement("button");
        favoriteRemoveButton.textContent = "delete";

        favoriteItem.append(favoriteIcon);
        favoriteItem.append(favoriteName);
        favoriteItem.append(favoriteRemoveButton);

        favoritesEl.append(favoriteItem);
    }

}

loadFavorites();