var RECIPE_URL = 'https://api.edamam.com/api/recipes/v2?type=public&app_id=3f79b5d7&app_key=81dbb6cafe543467792c934f5e6b64ca&diet=balanced&mealType=&mealType=Breakfast&mealType=Dinner&mealType=Lunch&random=true';

// first api for meals BASE URL : GET https://api.edamam.com/api/recipes/

// global variables?

var name;
var(mealObj []; 
// use variable object to pull localstrorage on page?

//define the function
function getrecipeinfo(event) {
    event.preventDefault();
    results.setAttribute()// idk what to set this as i am lost here
     var searchInputEl = $("#search-ingredient-input")
     var mealName

}

fetch(RECIPE_URL)
.then(response => response.json())
.then(response=> {

    // define variables of what we are pulling from the meal api

    var mealName = response.mealName;

})
)