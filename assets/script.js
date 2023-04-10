// Constants
const api_id = '3f79b5d7'
const api_key = '81dbb6cafe543467792c934f5e6b64ca'
const RECIPE_URL = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${api_id}&app_key=${api_key}&mealType={SearchMealValue}`;
const LS_FAVORITES = "Favorites-List"; // This is used to set/get the list of favorites localStorage item

// Global Variables
// DOM Elements
// Meals Search HTML Elements
var mealBreakfast = document.querySelector('#meal-breakfast')
var mealLunch = document.querySelector('#meal-lunch')
var mealDinner = document.querySelector('#meal-dinner')
var searchMeal = document.querySelector('#meal-search')
var searchMealForm = document.getElementById("meal-search-form");
var recipesFormBtn = document.getElementById("meal-results-submit")
var mealResultsDiv = document.getElementById("meal-results");
// Cocktails Search HTML Elements
var searchForm = document.querySelector('#search-form');
var cocktailsFormBtn = document.getElementById("results-submit")
var randomBtn = document.querySelector("#random-button");
var resultsDiv = document.querySelector('#results');
// Favorites HTML element
var favoritesListEl = document.getElementById("favorites-list");
var favoritesMealsEl = document.getElementById("favorites-meals");
var favoritesCocktailsEl = document.getElementById("favorites-cocktails");
var openModalBtn = document.getElementById("favorites-button");

// Event Listeners
searchMealForm.addEventListener("submit", function (event) {
  event.preventDefault();

  fetchMeal();
});

document.addEventListener('DOMContentLoaded', function () {
  var selectEls = document.querySelectorAll('select');
  var selectInstances = M.FormSelect.init(selectEls);

  var hamburgerBtn = document.querySelectorAll('.sidenav');
  var hamburgerInstance = M.Sidenav.init(hamburgerBtn);
});

recipesFormBtn.addEventListener("click", function (event) {
  event.preventDefault();

  var recipesCheckboxes = document.querySelectorAll("#meal-results input[type=checkbox]:checked");

  for (let i = 0; i < recipesCheckboxes.length; i++) {
    var nextSpanSibling = recipesCheckboxes[i].nextElementSibling;

    saveFavorite(nextSpanSibling.textContent, "meal");

    recipesCheckboxes[i].checked = false;
  }
});

cocktailsFormBtn.addEventListener("click", function (event) {

  event.preventDefault();

  var cocktailsCheckboxes = document.querySelectorAll("#results input[type=checkbox]:checked");

  for (let i = 0; i < cocktailsCheckboxes.length; i++) {
    var nextSpanSibling = cocktailsCheckboxes[i].nextElementSibling;

    saveFavorite(nextSpanSibling.textContent, "cocktail");

    cocktailsCheckboxes[i].checked = false;
  }
});

// Favorites UL click handler - button to delete fav item
favoritesListEl.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();

  // Verify the element clicked is a <button>
  if (event.target.tagName === "BUTTON") {

    var parentNode = event.target.parentNode;
    var favoriteIndex = parentNode.getAttribute("data-fav-idx");

    // Delete item from favorites
    deleteFavorite(favoriteIndex);
    loadFavorites();
  }
});

// Display favorites modal when Favorites navbar link is clicked
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

  getRandomCocktail().then((results) => {
    displayResults(results);
  });

});

function fetchMeal() {
  var recipeUrl = RECIPE_URL.replace("{SearchMealValue}", searchMeal.value);
  
  fetch(recipeUrl, { cache: "force-cache" })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // get the array of recipes from response (hits)
      var mealResults = data.hits;

      mealResultsDiv.innerHTML = '';

      const list = document.createElement('ul');

      for (const meal of mealResults) {
        const listItem = document.createElement('li');
        var labelEl = document.createElement("label");

        labelEl.classList.add("black-text")
        
        var checkboxEl = document.createElement("input");
        checkboxEl.setAttribute("type", "checkbox");

        const mealName = document.createElement('span');
        mealName.textContent = meal.recipe.label;

        labelEl.append(checkboxEl);
        labelEl.appendChild(mealName);

        listItem.append(labelEl);

        list.appendChild(listItem);
      }

      mealResultsDiv.appendChild(list);
      mealResultsDiv.parentElement.classList.remove("hide");
    });
}

// Retrieve list of favorites from LocalStorage and create HTML
function loadFavorites() {

  // Remove all children nodes from favorites HTML element
  removeAllChildNodes(favoritesMealsEl);
  removeAllChildNodes(favoritesCocktailsEl);

  // Retrieve array of favorites from localStorage
  var listFavorites = JSON.parse(localStorage.getItem(LS_FAVORITES));

  // Get message elemenet inside fav modal, add/remove "hide" class below depending on number of faves saved
  var modalHelperMsg = document.getElementById("fav-helper")

  // Check if list of favorites exists or is empty
  // If array is null, then save an empty array string to localStorage and stop function execution
  // If array is empty, stop function execution
  if (listFavorites === null) {
    listFavorites = [];
    localStorage.setItem(LS_FAVORITES, JSON.stringify(listFavorites));

    modalHelperMsg.classList.remove("hide");

    return;
  }
  else if (listFavorites.length === 0) {
    modalHelperMsg.classList.remove("hide");
    
    return;
  }

  modalHelperMsg.classList.add("hide");

  // Loop through list of favorites and create individual HTML elements for each
  for (var i = 0; i < listFavorites.length; i++) {
    var favoriteItem = document.createElement("div");
    favoriteItem.setAttribute("data-fav-idx", i);
    favoriteItem.classList.add("row");
    favoriteItem.classList.add("grey");
    favoriteItem.classList.add("lighten-2");
    favoriteItem.textContent = listFavorites[i].recipeName;

    var favoriteRemoveButton = document.createElement("button");
    favoriteRemoveButton.textContent = "X";
    favoriteRemoveButton.classList.add("btn-flat");
    favoriteRemoveButton.classList.add("right");

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
  
  return searchResults;
}

// display search results
function displayResults(results) {
  resultsDiv.innerHTML = '';

  const cocktails = results[0].drinks.splice(0, 20);
  const list = document.createElement('ul');


  for (const cocktail of cocktails) {
    const listItem = document.createElement('li');

    var labelEl = document.createElement("label");

    labelEl.classList.add("black-text")

    var checkboxEl = document.createElement("input");
    checkboxEl.setAttribute("type", "checkbox");
    
    const cocktailName = document.createElement('span');
    cocktailName.textContent = cocktail.strDrink;

    labelEl.append(checkboxEl);
    labelEl.appendChild(cocktailName);

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
