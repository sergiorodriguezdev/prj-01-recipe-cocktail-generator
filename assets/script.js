var mealBreakfast = document.querySelector('#something') // still need to add to html with the drop down tag
var mealLunch = document.querySelector('#something')
var mealDinner = document.querySelector('#something')
var api_id = '3f79b5d7'
var api_key = '81dbb6cafe543467792c934f5e6b64ca'

var RECIPE_URL = 'https://api.edamam.com/api/recipes/v2?';

// first api for meals BASE URL : GET https://api.edamam.com/api/recipes/


// global variables?

var recipeName;
var recipeObj = [];
var cocktailName;

var cocktailObj = [];

// use variable object to pull localstrorage on page?

//define the function for recipe return

function getUrl() {
  RECIPE_URL += 'api_id=' + api_id;
  RECIPE_URL += 'api_key' + api_key;
  if (mealBreakfast.value) {
    RECIPE_URL += '&mealType=Breakfast';
  }
  if (mealLunch.value) {
    RECIPE_URL += '&mealType=Lunch';
  }
  if (mealDinner.value) {
    RECIPE_URL += '&mealType=Dinner';
  }

}  // forgot this little bugger lol
function fetchMeal() {
  var RECIPE_URL = getUrl();
fetch(RECIPE_URL)
.then(function(response)
{
  return response.json();
})
.then(function (data) {
  console.log(data);
});
}
    // define variables of what we are pulling from the meal api

    var mealType = response.mealType; // ex: breakfast, lunch, and dinner


var recipes = document.getElementById("recipes-results")
var cocktails = document.getElementById("cocktails-results")
var recipesFormBtn = document.getElementById("recipes-res-submit")
var cocktailsFormBtn = document.getElementById("cocktails-res-submit")

var myData = [
  {
    name: "Recipe 1"
  },
  {
    name: "Recipe 2"
  },
  {
    name: "Recipe 3"
  }
];

var myCocktails = [
  {
    name: "Cocktail 1"
  },
  {
    name: "Cocktail 2"
  },
  {
    name: "Cocktail 3"
  }
];

loadResults(recipes, "recipes", myData);
loadResults(cocktails, "cocktails", myCocktails)

function loadResults(resultsForm, type, data) {

  if (data === null) {
    data = []
  }
  if (data.length === 0) {
    //no results found
  } else {
    if (type === "recipes") {
      recipesFormBtn.disabled = false;
    } else if (type === "cocktails") {
      cocktailsFormBtn.disabled = false;
    }
  }

  for (let index = 0; index < data.length; index++) {
    var resultsRow = document.createElement("p");

    var labelEl = document.createElement("label");

    resultsRow.append(labelEl);

    var checkboxEl = document.createElement("input");
    checkboxEl.setAttribute("type", "checkbox");

    labelEl.append(checkboxEl);

    var spanEl = document.createElement("span");
    spanEl.textContent = data[index].name;

    labelEl.append(spanEl);

    resultsForm.append(resultsRow);
  }
}


recipesFormBtn.addEventListener("click", function (event) {
  event.preventDefault();

  var recipesCheckboxes = document.querySelectorAll("#recipes-results input[type=checkbox]:checked");

  for (let i = 0; i < recipesCheckboxes.length; i++) {
    var nextSpanSibling = recipesCheckboxes[i].nextElementSibling;

    saveFavorite(nextSpanSibling.textContent, "meal");

  }
});

cocktailsFormBtn.addEventListener("click", function (event) {

  event.preventDefault();

  var cocktailsCheckboxes = document.querySelectorAll("#cocktails-results input[type=checkbox]:checked");

  for (let i = 0; i < cocktailsCheckboxes.length; i++) {
    var nextSpanSibling = cocktailsCheckboxes[i].nextElementSibling;

    saveFavorite(nextSpanSibling.textContent, "cocktail");

  }
});

// This is used to set/get the list of favorites localStorage item
var LS_FAVORITES = "Favorites-List";

// Favorites HTML element
var favoritesListEl = document.getElementById("favorites-list");
var favoritesMealsEl = document.getElementById("favorites-meals");
var favoritesCocktailsEl = document.getElementById("favorites-cocktails");


// Retrieve list of favorites from LocalStorage and create HTML
function loadFavorites() {

  // Remove all children nodes from favorites HTML element
  removeAllChildNodes(favoritesMealsEl);
  removeAllChildNodes(favoritesCocktailsEl);

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
    favoriteItem.setAttribute("data-fav-idx", i);

    var favoriteIcon = document.createElement("img");

    var favoriteName = document.createElement("h3");
    favoriteName.textContent = listFavorites[i].recipeName;

    var favoriteRemoveButton = document.createElement("button");
    favoriteRemoveButton.textContent = "Remove";

    favoriteItem.append(favoriteIcon);
    favoriteItem.append(favoriteName);
    favoriteItem.append(favoriteRemoveButton);

    if (listFavorites[i].type === "meal") {
      favoritesMealsEl.append(favoriteItem);
    } else if (listFavorites[i].type === "cocktail") {
      favoritesCocktailsEl.append(favoriteItem);
    }
  }
}

// Delete the array element from the list of favorites stored in localStorage by its index
function deleteFavorite(index) {
  // Retrieve array of favorites from localStorage
  var listFavorites = JSON.parse(localStorage.getItem(LS_FAVORITES));

  // Remove 1 array element at the specified index
  listFavorites.splice(index, 1);

  // Save updated array to localStorage
  localStorage.setItem(LS_FAVORITES, JSON.stringify(listFavorites));
}

// Remove all children nodes from parent HTML element
// Credit: https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }

}

// Favorites UL click handler
favoritesListEl.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();

  // Verify the element clicked is a <button>
  if (event.target.tagName === "BUTTON") {
    // Remove the button's parent element
    // event.target.parentNode.remove();

    var parentNode = event.target.parentNode;
    var favoriteIndex = parentNode.getAttribute("data-fav-idx");

    deleteFavorite(favoriteIndex);
    loadFavorites();
  }
});



// Open modal sample
var openModalBtn = document.getElementById("favorites-button");
openModalBtn.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("here s s s s s")
  // Initialize modal
  var favModal = document.getElementById("modal-favorites");
  var modalInstance = M.Modal.init(favModal);

  // Initialize collapsible list
  var favCollapsible = document.querySelectorAll('.collapsible.expandable');
  var collapsibleInstance = M.Collapsible.init(favCollapsible, {
    accordion: false
  });

  loadFavorites();
  modalInstance.open();
});

// Search For a cocktail by name
async function searchCocktails(cocktailName) {
  const apiKey = "1";
  const endpoint = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/search.php?s=${cocktailName}`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
// Generate a random Cocktail
async function getRandomCocktail() {
  const apiKey = "1";
  const endpoint = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/random.php`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// search by ingredient
async function searchCocktailsByIngredients(ingredients) {
  const apiKey = "1";
  const searchResults = [];
  for (const ingredient of ingredients) {
    const endpoint = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/filter.php?i=${ingredient}`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      searchResults.push(data);
    } catch (error) {
      console.log(error);
    }
  }
  return searchResults;
}
searchCocktailsByIngredients(["gin", "vodka", "tequila", "rum", "whiskey", "brandy"]).then((results) => {
  console.log(results);
});
var searchForm = document.querySelector('#search-form');
var resultsDiv = document.querySelector('#results');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const ingredientsInput = document.querySelector('#ingredients');
  const ingredients = ingredientsInput.value.split(',').map((ingredient) => ingredient.trim());
  searchCocktailsByIngredients(ingredients).then((results) => {
    displayResults(results);
  });
});
// display search results
function displayResults(results) {
  resultsDiv.innerHTML = '';
  for (const result of results) {
    const title = document.createElement('h2');
    title.textContent = result.ingredients[0].toUpperCase() + result.ingredients.slice(1) + ' Cocktails';
    resultsDiv.appendChild(title);
    const cocktails = result.drinks;
    const list = document.createElement('ul');
    for (const cocktail of cocktails) {
      const listItem = document.createElement('li');
      const cocktailLink = document.createElement('a');
      cocktailLink.textContent = cocktail.strDrink;
      cocktailLink.href = `/cocktail/${cocktail.idDrink}`;
      listItem.appendChild(cocktailLink);
      list.appendChild(listItem);
    }
    resultsDiv.appendChild(list);
  }
}



function saveFavorite(item, type) {
  var existing = JSON.parse(localStorage.getItem(LS_FAVORITES));

  if (!existing.length) {
    existing = [];
  }

  existing.push({
    type: type,
    recipeName: item
  });

  localStorage.setItem(LS_FAVORITES, JSON.stringify(existing));
}
