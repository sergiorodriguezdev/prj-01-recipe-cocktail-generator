var RECIPE_URL = 'https://api.edamam.com/api/recipes/v2?type=public&app_id=3f79b5d7&app_key=81dbb6cafe543467792c934f5e6b64ca&diet=balanced&mealType=&mealType=Breakfast&mealType=Dinner&mealType=Lunch&random=true';

// first api for meals BASE URL : GET https://api.edamam.com/api/recipes/

fetch(RECIPE_URL)
.then(response => response.json())
.then(response=> {

    // define variables of what we are pulling from the meal api

    var recipeName = response.recipeName;
})