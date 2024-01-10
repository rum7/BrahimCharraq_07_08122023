import { getRecipes } from "./data/data_recipes.js"
import { displayFilterTag, displaySelectedTag, removeSelectedTag } from "./scripts/displayFilters.js"
import { displayRecipes } from "./scripts/displayRecipes.js"
import "./scripts/search-input.js"

const { recipes, ingredients, appareils, ustensils } = await getRecipes()

displayRecipes(recipes)
displayFilterTag(ingredients, appareils, ustensils)

const recipeCounterNode = document.querySelector('.recipes-counter')
let recipeCounter = recipes.length
recipeCounterNode.textContent = `${recipeCounter} recettes`

const searchRecipe = document.getElementById('search-recipe')
searchRecipe.addEventListener('input', filterRecipes)

const recipesCards = Array.from(document.getElementById('recipes-container').children)
const tagsIngredientsList = Array.from(document.getElementById('tags-ingredients-list').children)
const tagsAppareilsList = Array.from(document.getElementById('tags-appareils-list').children)
const tagsUstensilsList = Array.from(document.getElementById('tags-ustensils-list').children)

const tagnameFilter = Array.from(document.querySelectorAll('.tagname-filter'))
tagnameFilter.forEach((filter) => filter.addEventListener('click', filterRecipes))
let selectedTag = []

function filterRecipes(event) {
    let searchValue

    if(tagnameFilter.includes(event.target) || event.target.classList.contains('tag-on')) {
        searchValue = searchRecipe.value

        if(event.target.classList.contains('selected')) {
            selectedTag = [...selectedTag, event.currentTarget.textContent.toLowerCase()]
            const newTag = displaySelectedTag(event)
            newTag.addEventListener('click', filterRecipes)
        } else {
            const indexTagToRemove = selectedTag.indexOf(event.currentTarget.textContent.toLowerCase())
            removeSelectedTag(event.currentTarget.textContent)
            selectedTag.splice(indexTagToRemove, 1)
        }
    } else {
        searchValue = event.currentTarget.value.toLowerCase()
    }

    const searchKeywords = searchValue.split(' ')
    let visibleRecipeIngredients = []
    let visibleRecipeAppareils = []
    let visibleRecipeUstensils = []

    if (searchValue.trim().length >= 3 || selectedTag.length >= 1) {
        recipes.forEach((recipe, index) => {
            const nameKeywords = [recipe.name.toLowerCase()]
            const ingredientsKeywords = recipe.ingredients.map(item => item.ingredient.toLowerCase()).flat()
            const descriptionKeywords = recipe.description.toLowerCase()
            const applianceKeywords = recipe.appliance.toLowerCase()
            const ustensilsKeywords = recipe.ustensils.map(item => item.toLowerCase())
            const recipeCardKeywords = [... new Set([... nameKeywords, ingredientsKeywords, descriptionKeywords, applianceKeywords, ustensilsKeywords].flat())]
            const recipeFiltersKeywords = [... new Set([... ingredientsKeywords, applianceKeywords, ustensilsKeywords].flat())]

            const searchIsMatching = searchKeywords.every(word => recipeCardKeywords.some(keyword => keyword.includes(word)))
            const filterIsMatching = selectedTag.every(word => recipeFiltersKeywords.includes(word))
            const displayCard = searchIsMatching && filterIsMatching
            displayCard ? recipesCards[index].classList.remove('hidden') : recipesCards[index].classList.add('hidden')
            
            if (displayCard) {
                recipesCards[index].classList.remove('hidden')
                visibleRecipeIngredients = [...visibleRecipeIngredients, ingredientsKeywords]
                visibleRecipeAppareils = [...visibleRecipeAppareils, applianceKeywords]
                visibleRecipeUstensils = [...visibleRecipeUstensils, ustensilsKeywords]
            } else {
                recipesCards[index].classList.add('hidden')
            }            
        })
    } else {
        recipesCards.forEach(recipe => recipe.classList.remove('hidden'))
    }

    // Update all filter list
    // const visibleRecipes = document.querySelectorAll('.recipe-card:not(.hidden)')
    // console.log('visibleRecipes: ', visibleRecipes)

    const hiddenRecipes = document.querySelectorAll('.recipe-card.hidden')
    visibleRecipeIngredients = [... new Set(visibleRecipeIngredients.flat())]
    visibleRecipeUstensils = [... new Set(visibleRecipeUstensils.flat())]

    tagsIngredientsList.forEach((tagIngredient, index) => {
        const isMatch = visibleRecipeIngredients.includes(tagIngredient.children[0].textContent.toLowerCase())
        isMatch || visibleRecipeIngredients.length === 0 ? tagsIngredientsList[index].classList.remove('hidden')
        : tagsIngredientsList[index].classList.add('hidden')
    })

    tagsAppareilsList.forEach((tagAppareil, index) => {
        const isMatch = visibleRecipeAppareils.includes(tagAppareil.children[0].textContent.toLowerCase())
        isMatch || visibleRecipeAppareils.length === 0 ? tagsAppareilsList[index].classList.remove('hidden')
        : tagsAppareilsList[index].classList.add('hidden')
    })

    tagsUstensilsList.forEach((tagUstensil, index) => {
        const isMatch = visibleRecipeUstensils.includes(tagUstensil.children[0].textContent.toLowerCase())
        isMatch || visibleRecipeUstensils.length === 0 ? tagsUstensilsList[index].classList.remove('hidden')
        : tagsUstensilsList[index].classList.add('hidden')
    })

    // Update recipe counter
    recipeCounter = recipes.length - hiddenRecipes.length
    recipeCounterNode.textContent = `${recipeCounter} ${recipeCounter > 1 ? 'recettes':'recette'}`
}