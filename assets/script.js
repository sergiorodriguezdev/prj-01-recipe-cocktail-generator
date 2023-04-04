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
  const searchForm = document.querySelector('#search-form');
  const resultsDiv = document.querySelector('#results');
  
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
  