





[
        {
            recipeName: "some name"
            type: "meal"
        },
        {
            recipeName: "some cocktail"
            type: "cocktail"
        }
]

const LS_FAVORITES = "Favorites-List"

var listFavorites = JSON.parse(localStorage.getItem(LS_FAVORITES));

localStorage.setItem(LS_FAVORITES, JSON.stringify(someArray));


if (localStorage.clickcount) {
    localStorage.clickcount = Number(localStorage.clickcount) + 1;
  } else {
    localStorage.clickcount = 1;
  }