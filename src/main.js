// import "./scripts/filters-dropdown.js"
import "./scripts/search-input.js"
import { getRecipes } from "./data/data_recipes.js"
import { displayFilterTag } from "./scripts/displayFilters-dropdown.js"
import { displayRecipes } from "./scripts/displayRecipes.js"
// import { filterRecipes } from "./scripts/filterRecipes.js"

const { recipes, ingredients, appareils, ustensils } = await getRecipes()

displayRecipes(recipes)
displayFilterTag(ingredients, appareils, ustensils)

const recipesContainer = document.getElementById('recipes-container')
const recipesCards = Array.from(recipesContainer.children)

const searchRecipe = document.getElementById('search-recipe')
searchRecipe.addEventListener('input', filterRecipes)

function filterRecipes(event) {
    const searchValue = event.currentTarget.value.toLowerCase()
    if (searchValue.trim().length >= 3) {
        for (let i = 0; i < recipes.length; i++) {
            const name = recipes[i].name.toLowerCase()
            if(!name.includes(searchValue)) {
                console.log('searchValue: ', searchValue)
                console.log(`recipes[${i}]: `, recipes[i].name)
                recipesCards[i].classList.add('hidden')
            }
        }
    } else {
        recipesCards.forEach(recipe => recipe.classList.remove('hidden'))
    }
}