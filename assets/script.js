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
async function searchCocktailsByIngredient(ingredient) {
    const apiKey = "1";
    const endpoint = `https://www.thecocktaildb.com/api/json/v1/${apiKey}/filter.php?i=${ingredient}`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  searchCocktailsByIngredient("gin").then((data) => {
    console.log(data);
  });
  
  searchCocktailsByIngredient("vodka").then((data) => {
    console.log(data);
  });
  