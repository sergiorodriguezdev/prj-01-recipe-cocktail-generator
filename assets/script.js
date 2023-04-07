var mealBreakfast = document.querySelector('#meal-breakfast') // still need to add to html with the drop down tag
var mealLunch = document.querySelector('#meal-lunch')
var mealDinner = document.querySelector('#meal-dinner')
var api_id = '3f79b5d7'
var api_key = '81dbb6cafe543467792c934f5e6b64ca'
var searchMeal = document.querySelector('#meal-search')
var searchMealForm = document.getElementById("meal-search-form");
var mealResultsDiv = document.getElementById("meal-results");

var RECIPE_URL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${api_id}&app_key=${api_key}&mealType={SearchMealValue}`;

// first api for meals BASE URL : GET https://api.edamam.com/api/recipes/


// global variables?

var recipeName;
var recipeObj = [];
var cocktailName;

var cocktailObj = [];

// use variable object to pull localstrorage on page?

//define the function for recipe return

function getUrl() {
  // RECIPE_URL += '&app_id=' + api_id;
  // RECIPE_URL += '&app_key=' + api_key;

  // if (searchMeal.value === "Breakfast") {
  //   RECIPE_URL += '&mealType=Breakfast';
  // }
  // else if (searchMeal.value === "Breakfast") {
  //   RECIPE_URL += '&mealType=Lunch';
  // }
  // else if (searchMeal.value === "Breakfast") {
  //   RECIPE_URL += '&mealType=Dinner';
  // }

  // RECIPE_URL += "&mealType=" + searchMeal.value;
  return RECIPE_URL.replace("{SearchMealValue}", searchMeal.value);
}

function fetchMeal() {
  var recipeUrl = getUrl();
  console.log(recipeUrl)
  fetch(recipeUrl, {cache: "force-cache"})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      // get the array of recipes from response (hits)
      var mealResults = data.hits;

      mealResultsDiv.innerHTML = '';

      const list = document.createElement('ul');

      for (const meal of mealResults) {
        const listItem = document.createElement('li');

        const cocktailLink = document.createElement('span');
        cocktailLink.textContent = meal.recipe.label;

        var labelEl = document.createElement("label");

        var checkboxEl = document.createElement("input");
        checkboxEl.setAttribute("type", "checkbox");

        labelEl.append(checkboxEl);

        labelEl.appendChild(cocktailLink);

        listItem.append(labelEl);

        list.appendChild(listItem);
      }

      mealResultsDiv.appendChild(list);
      mealResultsDiv.parentElement.classList.remove("hide");
    });
}

searchMealForm.addEventListener("submit", function (event) {
  event.preventDefault();

  fetchMeal();
});

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
});

var recipes = document.getElementById("recipes-results")
var cocktails = document.getElementById("cocktails-results")
var recipesFormBtn = document.getElementById("meal-results-submit")
var cocktailsFormBtn = document.getElementById("results-submit")

recipesFormBtn.addEventListener("click", function (event) {
  event.preventDefault();

  var recipesCheckboxes = document.querySelectorAll("#meal-results input[type=checkbox]:checked");

  for (let i = 0; i < recipesCheckboxes.length; i++) {
    var nextSpanSibling = recipesCheckboxes[i].nextElementSibling;

    saveFavorite(nextSpanSibling.textContent, "meal");

  }
});

cocktailsFormBtn.addEventListener("click", function (event) {

  event.preventDefault();

  var cocktailsCheckboxes = document.querySelectorAll("#results input[type=checkbox]:checked");

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
  console.log(endpoint)
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(data)
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
    const data = [await response.json()];
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
  console.log(searchResults)
  return searchResults;
}
searchCocktailsByIngredients(["gin", "vodka", "tequila", "rum", "whiskey", "brandy"]).then((results) => {
  console.log(results);
});
var searchForm = document.querySelector('#search-form');
var randomBtn = document.querySelector("#random-button");
var resultsDiv = document.querySelector('#results');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const ingredientsInput = document.querySelector('#ingredients');
  // Create an array of ingredients from comma separated list entered in search box
  const ingredients = ingredientsInput.value.split(',').map((ingredient) => ingredient.trim());
  searchCocktailsByIngredients(ingredients).then((results) => {
    displayResults(results);
  });
});

randomBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const ingredients = ["Random"]
  getRandomCocktail(ingredients).then((results) => {
    displayResults(results);
  });

});

// display search results
function displayResults(results) {
  resultsDiv.innerHTML = '';

  const title = document.createElement('h2');
  const ingredientsInput = document.querySelector('#ingredients');
  title.textContent = ingredientsInput.value + " Cocktail";
  resultsDiv.appendChild(title);

  const cocktails = results[0].drinks;
  const list = document.createElement('ul');

  (cocktails.length > 1) ? title.textContent += "s" : title.textContent += ""

  for (const cocktail of cocktails) {
    const listItem = document.createElement('li');

    const cocktailLink = document.createElement('span');
    cocktailLink.textContent = cocktail.strDrink;
    // cocktailLink.href = `/cocktail/${cocktail .idDrink}`;

    var labelEl = document.createElement("label");

    var checkboxEl = document.createElement("input");
    checkboxEl.setAttribute("type", "checkbox");

    labelEl.append(checkboxEl);

    labelEl.appendChild(cocktailLink);

    listItem.append(labelEl);

    list.appendChild(listItem);
  }

  resultsDiv.appendChild(list);
  resultsDiv.parentElement.classList.remove("hide");
}


function saveFavorite(item, type) {
  var existing = JSON.parse(localStorage.getItem(LS_FAVORITES));

  if (existing === null) {
    existing = [];
  }

  if (!existing.length) {
    existing = [];
  }

  existing.push({
    type: type,
    recipeName: item
  });

  localStorage.setItem(LS_FAVORITES, JSON.stringify(existing));
}
