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
const searchErrorMsg = document.getElementById('search-error')

const recipesCards = Array.from(document.getElementById('recipes-container').children)
const tagsIngredientsList = Array.from(document.getElementById('tags-ingredients-list').children)
const tagsAppareilsList = Array.from(document.getElementById('tags-appareils-list').children)
const tagsUstensilsList = Array.from(document.getElementById('tags-ustensils-list').children)

const tagnameFilter = Array.from(document.querySelectorAll('.tagname-filter'))
tagnameFilter.forEach((filter) => filter.addEventListener('click', filterRecipes))

let selectedTag = []
let visibleTagIngredients = []
let visibleTagAppareils = []
let visibleTagUstensils = []


/**
 * LINEAR SEARCH FUNCTION
 */
function filterRecipes(event) {
    let searchValue
    // Define current searchValue
    // Hide or display selected tag in the current filter list block 
    if(event.target.nodeName === 'BUTTON') {
        searchValue = searchRecipe.value.trim()
        const tagParentId = event.currentTarget.closest('ul').id || event.currentTarget.getAttribute('data-filter-category')

        if(event.target.classList.contains('selected')) {
            const tagContent = {}
            tagContent[event.currentTarget.textContent.toLowerCase()] = tagParentId
            selectedTag = [...selectedTag, tagContent]
            const newTag = displaySelectedTag(event)
            newTag.addEventListener('click', filterRecipes)
        } else {
            let tagToRemove = event.currentTarget.textContent.toLowerCase()
            let indexTagToRemove
            for (let index = 0; index < selectedTag.length; index++) {
              if (Object.keys(selectedTag[index])[0] === tagToRemove) {
                indexTagToRemove = index
                break
              }
            }
            removeSelectedTag(tagToRemove, tagParentId)
            selectedTag.splice(indexTagToRemove, 1)
        }
    } else {
        searchValue = event.currentTarget.value.trim()
    }

    // Checking input value contains errors
    const regxChar = /[^\p{L}\s']/gu
    if (regxChar.test(searchValue)) {
        searchRecipe.classList.add('focus:outline-red-500', 'outline-red-500')
        searchErrorMsg.classList.remove('invisible')
        return
    } else {
        searchRecipe.classList.remove('focus:outline-red-500', 'outline-red-500')
        searchErrorMsg.classList.add('invisible')
    }

    // Initiate list of keywords
    let searchKeywords = searchValue.length >= 3 ? searchValue.replace(/[^\p{L}\s]/gu, '').split(' ') : []
    for (let index = searchKeywords.length - 1; index >= 0; index--) {
        searchKeywords[index] === "" ? searchKeywords.splice(index, 1) : ''
    }
    let visibleRecipeIngredients = []
    let visibleRecipeAppareils = []
    let visibleRecipeUstensils = []

    if (searchValue.trim().length >= 3 || selectedTag.length >= 1) {
        recipes.forEach((recipe, index) => {
            // Input research
            const nameKeywords = [... new Set(recipe.name.toLowerCase().split(' '))]

            let descriptionKeywords = recipe.description.toLowerCase().replace(/[^\p{L}\s]/gu, '').replace(/\s{2,}/g, ' ').trim()
            descriptionKeywords = [... new Set(descriptionKeywords.split(' '))]

            const ingredientsKeywords = recipe.ingredients.map(item => item.ingredient.toLowerCase()).flat()

            const recipeCardKeywords = [... new Set([... nameKeywords, ingredientsKeywords, descriptionKeywords].flat())]

            let searchIsMatching

            if (searchKeywords.length >= 1) {
                searchIsMatching = searchKeywords.every(word => recipeCardKeywords.some(keyword => keyword.includes(word)))
            }
                

            // Tag research
            const appareilsKeywords = [recipe.appliance.toLowerCase()]

            const ustensilsKeywords = recipe.ustensils.map(item => item.toLowerCase())

            let filterIsMatching

            if (selectedTag.length >= 1) {
                filterIsMatching = selectedTag.every(word => {
                    if (Object.values(word)[0] === "tags-ingredients-list") {
                        return ingredientsKeywords.includes(Object.keys(word)[0])
                    }
                    if (Object.values(word)[0] === "tags-appareils-list") {
                        return appareilsKeywords.includes(Object.keys(word)[0])
                    }
                    if (Object.values(word)[0] === "tags-ustensils-list") {
                        return ustensilsKeywords.includes(Object.keys(word)[0])
                    }
                })
            }

            const displayCard = (searchIsMatching??true) && (filterIsMatching??true)

            if (displayCard) {
                recipesCards[index].classList.remove('hidden')
                visibleRecipeIngredients = [...visibleRecipeIngredients, ingredientsKeywords]
                visibleRecipeAppareils = [...visibleRecipeAppareils, appareilsKeywords]
                visibleRecipeUstensils = [...visibleRecipeUstensils, ustensilsKeywords]
            } else {
                recipesCards[index].classList.add('hidden')
            }            
        })
    } else {
        recipesCards.forEach(recipe => recipe.classList.remove('hidden'))
    }

    const hiddenRecipes = document.querySelectorAll('.recipe-card.hidden')
    visibleRecipeIngredients = [... new Set(visibleRecipeIngredients.flat())]
    visibleRecipeAppareils = [... new Set(visibleRecipeAppareils.flat())]
    visibleRecipeUstensils = [... new Set(visibleRecipeUstensils.flat())]

    visibleTagIngredients = Array.from(document.querySelectorAll('#tags-ingredients-list > li:not(.hidden)'))
    visibleTagAppareils = Array.from(document.querySelectorAll('#tags-appareils-list > li:not(.hidden)'))
    visibleTagUstensils = Array.from(document.querySelectorAll('#tags-ustensils-list > li:not(.hidden)'))

    // Update tags list from current research
    tagsIngredientsList.forEach((tagIngredient, index) => {
        const isMatch = visibleRecipeIngredients.includes(tagIngredient.children[0].textContent.toLowerCase())
        isMatch || tagIngredient.children[0].classList.contains('selected') || visibleRecipeIngredients.length === 0 ? tagsIngredientsList[index].classList.remove('hidden')
        : tagsIngredientsList[index].classList.add('hidden')
    })

    tagsAppareilsList.forEach((tagAppareil, index) => {
        const isMatch = visibleRecipeAppareils.includes(tagAppareil.children[0].textContent.toLowerCase())
        isMatch || tagAppareil.children[0].classList.contains('selected') || visibleRecipeAppareils.length === 0 ? tagsAppareilsList[index].classList.remove('hidden')
        : tagsAppareilsList[index].classList.add('hidden')
    })

    tagsUstensilsList.forEach((tagUstensil, index) => {
        const isMatch = visibleRecipeUstensils.includes(tagUstensil.children[0].textContent.toLowerCase())
        isMatch || tagUstensil.children[0].classList.contains('selected') || visibleRecipeUstensils.length === 0 ? tagsUstensilsList[index].classList.remove('hidden')
        : tagsUstensilsList[index].classList.add('hidden')
    })

    // Update recipe counter
    recipeCounter = recipes.length - hiddenRecipes.length
    recipeCounterNode.textContent = `${recipeCounter} ${recipeCounter > 1 ? 'recettes':'recette'}`

    // If we don't found any recipe
    const noResult = document.querySelector('.no-recipe-message')
    if (recipeCounter === 0) {
        noResult.classList.remove('hidden')
        let currentSearchTag = []
        for (const tag of selectedTag) { currentSearchTag = [... currentSearchTag, Object.keys(tag)[0]] }
        currentSearchTag = [... currentSearchTag, searchKeywords].flat()
        noResult.innerHTML = `Aucune recette ne contient <span class="italic">"${currentSearchTag.join(', ')}"</span>. Essayez plutôt de rechercher <span class="italic">« <strong>tarte aux pommes</strong> », « <strong>poisson</strong> », etc.</span>`

    }else{
        noResult.classList.add('hidden')
    }
}


// Listener to all type of tags to handle display during "tag research"
const filterIngredients = document.getElementById('filter-ingredients')
filterIngredients.addEventListener('input', (event) => {
    filterTags(event, visibleTagIngredients, "ingredients")
})

const filterAppareils = document.getElementById('filter-appareils')
filterAppareils.addEventListener('input', (event) => {
    filterTags(event, visibleTagAppareils, "appareils")
})

const filterUstensils = document.getElementById('filter-ustensils')
filterUstensils.addEventListener('input', (event) => {
    filterTags(event, visibleTagUstensils, "ustensils")
})

function filterTags(event, visibleTagList, tagType) {
    const searchValue = event.currentTarget.value.toLowerCase().trim()
    const keywordList = searchValue.split(' ')

    if (searchValue.length >= 1) {
        keywordList.every(word => {
            visibleTagList.some((keyword, index) => {
                const result = keyword.children[0].textContent.toLowerCase().indexOf(word)
                result !== -1 ? visibleTagList[index].classList.remove('hidden') : visibleTagList[index].classList.add('hidden')
            })
        })
    } else {
        for (const tag of visibleTagList) {
            tag.classList.remove('hidden')
        }
    }

    const hiddenTags = Array.from(document.querySelectorAll(`#tags-${tagType}-list > li.hidden`))
    const noResult = document.querySelector(`#tags-${tagType}-list`).nextElementSibling
    const inputElement = document.getElementById(`filter-${tagType}`)
    
    
    if (hiddenTags.length === visibleTagList.length && hiddenTags.length !== 0) {
        inputElement.classList.add('focus:outline-red-500')
        noResult.classList.remove('hidden')
    }else{
        inputElement.classList.remove('focus:outline-red-500')
        noResult.classList.add('hidden')
    }
}