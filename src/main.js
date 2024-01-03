import "./scripts/search-input.js"
import { getRecipes } from "./data/data_recipes.js"
import { displayFilterTag } from "./scripts/displayFilters-dropdown.js"
import { displayRecipes } from "./scripts/displayRecipes.js"

const { recipes, ingredients, appareils, ustensils } = await getRecipes()

displayRecipes(recipes)
displayFilterTag(ingredients, appareils, ustensils)

const recipeCounterNode = document.querySelector('.recipes-counter')
let recipeCounter = recipes.length
recipeCounterNode.textContent = `${recipeCounter} recettes`

const recipesCards = Array.from(document.getElementById('recipes-container').children)

const searchRecipe = document.getElementById('search-recipe')
searchRecipe.addEventListener('input', filterRecipes)

const tagsIngredientsList = Array.from(document.getElementById('tags-ingredients-list').children)

function filterRecipes(event) {
    const searchValue = event.currentTarget.value.toLowerCase()
    const searchKeywords = searchValue.split(' ')
    let hiddenRecipeNum = []

    if (searchValue.trim().length >= 3) {
        for (let i = 0; i < recipes.length; i++) {
            const nameKeywords = recipes[i].name.toLowerCase().split(' ')
            const ingredientsKeywords = recipes[i].ingredients.map(item => item.ingredient.toLowerCase().split(' ')).flat()
            const descriptionKeywords = recipes[i].description.toLowerCase().split(' ')
            const applianceKeywords = recipes[i].appliance.toLowerCase().split(' ')
            const ustensilsKeywords = recipes[i].ustensils.map(item => item.toLowerCase())
            const recipeKeywords = [... new Set([... nameKeywords, ingredientsKeywords, descriptionKeywords, applianceKeywords, ustensilsKeywords].flat())]

            const isMatch = searchKeywords.every(word => recipeKeywords.some(keyword => keyword.includes(word)))
            isMatch ? recipesCards[i].classList.remove('hidden') : recipesCards[i].classList.add('hidden')
        }
    } else {
        recipesCards.forEach(recipe => recipe.classList.remove('hidden'))
    }

    const hiddenRecipes = document.querySelectorAll('.recipe-card.hidden')
    hiddenRecipes.forEach(element => hiddenRecipeNum = [...hiddenRecipeNum, element.getAttribute('data-recipe-num')])

    tagsIngredientsList.forEach((tagId, index) => {
        const filterId = tagId.getAttribute('data-recipe-num').split(',')
        const isHidden = filterId.every(id => hiddenRecipeNum.includes(id))
        isHidden ? tagsIngredientsList[index].classList.add('hidden') : tagsIngredientsList[index].classList.remove('hidden')
    })

    recipeCounter = recipes.length - hiddenRecipes.length
    recipeCounterNode.textContent = `${recipeCounter} ${recipeCounter > 1 ? 'recettes':'recette'}`

    // const visibleRecipes = document.querySelectorAll('.recipe-card:not(.hidden)')
    // console.log('visibleRecipes: ', visibleRecipes)
}

/**
 * gestion des tags
 * -----------------
 * input search qui filtre la liste des tags
 * lorsqu'on clique sur un tag il s'affiche dans la liste des filtres et s'applique aux recettes
 * lorsqu'on reclique dessus, il disparait de la liste et la liste des recettes se met à jour
 * 
 */