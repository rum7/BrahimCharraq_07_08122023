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
let visibleTagIngredients = Array.from(document.querySelectorAll('#tags-ingredients-list > li:not(.hidden)'))
let visibleTagAppareils = Array.from(document.querySelectorAll('#tags-appareils-list > li:not(.hidden)'))
let visibleTagUstensils = Array.from(document.querySelectorAll('#tags-ustensils-list > li:not(.hidden)'))

/**
 * BINARY SEARCH FUNCTION
 */
function filterRecipes(event) {
    let searchValue

    if(event.target.nodeName === 'BUTTON') {
        searchValue = searchRecipe.value.toLowerCase().trim()

        if(event.target.classList.contains('selected')) {
            selectedTag = [...selectedTag, event.currentTarget.textContent.toLowerCase()]
            const newTag = displaySelectedTag(event)
            newTag.addEventListener('click', filterRecipes)
        } else {
            const indexTagToRemove = selectedTag.indexOf(event.currentTarget.textContent.toLowerCase())
            const tagParentId = event.currentTarget.closest('ul').id || event.currentTarget.getAttribute('data-filter-category')
            removeSelectedTag(event.currentTarget.textContent, tagParentId)
            selectedTag.splice(indexTagToRemove, 1)
        }
    } else {
        searchValue = event.currentTarget.value.toLowerCase().trim()
    }

    const searchKeywords = searchValue.split(' ')
    let visibleRecipeIngredients = []
    let visibleRecipeAppareils = []
    let visibleRecipeUstensils = []

    if (searchValue.length >= 3 || selectedTag.length >= 1) {

        for (let index = 0; index < recipes.length; index++) {
            const nameKeywords = [recipes[index].name.toLowerCase()]
            const descriptionKeywords = recipes[index].description.toLowerCase().replace(/[^\w\sàáâãäçèéêëìíîïòóôõöùúûü']/gi, '').replace(/[()%"'!@#$%^&*]/g, '').replace(/\s\s+/g, ' ')
            const appareilsKeywords = recipes[index].appliance.toLowerCase()

            let ingredientsKeywords = []
            for (const item of recipes[index].ingredients) {
                ingredientsKeywords = [... ingredientsKeywords, item.ingredient.toLowerCase().replace(/[^\w\sàáâãäçèéêëìíîïòóôõöùúûü']/gi, '').replace(/[()%"'!@#$%^&*]/g, '').replace(/\s\s+/g, ' ')]
            }
            ingredientsKeywords.flat()

            let ustensilsKeywords = []
            for (const item of recipes[index].ustensils) {
                ustensilsKeywords = [... ustensilsKeywords, item.toLowerCase()]
            }

            const recipeCardKeywords = [... new Set([... nameKeywords, ingredientsKeywords, descriptionKeywords, appareilsKeywords, ustensilsKeywords].flat())]
            const recipeFiltersKeywords = [... new Set([... ingredientsKeywords, appareilsKeywords, ustensilsKeywords].flat())]

            const searchIsMatching = searchKeywords.every(word => {
                const result = recipeCardKeywords.some(keyword => {
                    const result = isSearchMatching(keyword, word)
                    return result
                })
                return result
            })

            const filterIsMatching = selectedTag.every(word => {
                const result = isSearchMatching(recipeFiltersKeywords, word)
                return result
            })

            const displayCard = searchIsMatching && filterIsMatching
            if (displayCard) {
                recipesCards[index].classList.remove('hidden')
                visibleRecipeIngredients = [...visibleRecipeIngredients, ingredientsKeywords]
                visibleRecipeAppareils = [...visibleRecipeAppareils, appareilsKeywords]
                visibleRecipeUstensils = [...visibleRecipeUstensils, ustensilsKeywords]
            } else {
                recipesCards[index].classList.add('hidden')
            } 
        }

    } else {
        for (const recipe of recipesCards) {
            recipe.classList.remove('hidden')
        }
    }

    visibleRecipeIngredients = [... new Set(visibleRecipeIngredients.flat())]
    visibleRecipeUstensils = [... new Set(visibleRecipeUstensils.flat())]
    
    handleTagDisplaying(visibleRecipeIngredients, tagsIngredientsList)
    handleTagDisplaying(visibleRecipeAppareils, tagsAppareilsList)
    handleTagDisplaying(visibleRecipeUstensils, tagsUstensilsList)

    visibleTagIngredients = Array.from(document.querySelectorAll('#tags-ingredients-list > li:not(.hidden)'))
    visibleTagAppareils = Array.from(document.querySelectorAll('#tags-appareils-list > li:not(.hidden)'))
    visibleTagUstensils = Array.from(document.querySelectorAll('#tags-ustensils-list > li:not(.hidden)'))
    
    // Update recipe counter
    const hiddenRecipes = document.querySelectorAll('.recipe-card.hidden')
    recipeCounter = recipes.length - hiddenRecipes.length
    recipeCounterNode.textContent = `${recipeCounter} ${recipeCounter > 1 ? 'recettes':'recette'}`
}

function isSearchMatching(keywordList, searchingWord) {
    let keywords
    Array.isArray(keywordList) ? 
    keywords = keywordList.sort((a, b) => a.localeCompare(b))
    : keywords = [... new Set(keywordList.split(' '))].sort((a, b) => a.localeCompare(b))

    let start = 0
    let end = keywords.length - 1
    let found = false

    while (start <= end) {
        let mid = Math.floor((start + end) / 2)
        let middleKeyword = keywords[mid]
        let comparingWords = middleKeyword.localeCompare(searchingWord);

        // console.log('middleKeyword: ', middleKeyword)
        // console.log('middleKeyword est à gauche de searchingWord? ', comparingWords < 0)
        // console.log('middleKeyword est à droite de searchingWord? ', comparingWords > 0)
        // console.log('start | end | mid avant: ', start+' | '+end+' | '+mid)

        if (middleKeyword.indexOf(searchingWord) !== -1) {
            found = true
            break
        } else if (comparingWords < 0) {
            start = mid + 1
        } else if (comparingWords > 0) {
            end = mid - 1
        }

        // console.log('start | end | mid après: ', start+' | '+end+' | '+mid)
    }

    return found
}

function handleTagDisplaying(recipeList, tagList) {
    if (recipeList.length !== 0) {
        for (const tag of tagList) {
            let isVisible = false

            for (const visibleRecipe of recipeList) {
                if (visibleRecipe === tag.children[0].textContent.toLowerCase() || tag.children[0].classList.contains('selected')) {
                    isVisible = true
                }
            }

            if (isVisible === true) {
                tag.classList.remove('hidden')
                isVisible = false
            } else {
                tag.classList.add('hidden')
            }
        }
    } else {
        for (const tag of tagList) {
            tag.classList.remove('hidden')
        }
    }
}

const filterIngredients = document.getElementById('filter-ingredients')
filterIngredients.addEventListener('input', (event) => {
    filterTags(event, visibleTagIngredients)
})

const filterAppareils = document.getElementById('filter-appareils')
filterAppareils.addEventListener('input', (event) => {
    filterTags(event, visibleTagAppareils)
})

const filterUstensils = document.getElementById('filter-ustensils')
filterUstensils.addEventListener('input', (event) => {
    filterTags(event, visibleTagUstensils)
})

function filterTags(event, visibleTagList) {
    const searchValue = event.currentTarget.value.toLowerCase().trim()
    const keywordList = searchValue.split(' ')
    
    if (searchValue.length >= 3) {
        keywordList.every(word => {
            visibleTagList.some((keyword, index) => {
                const result = isSearchMatching(keyword.children[0].textContent.toLowerCase(), word)
                result === true ? visibleTagList[index].classList.remove('hidden') : visibleTagList[index].classList.add('hidden')
                /**ajouter un message s'il n'y a aucun résultat */
            })
        })
    } else {
        for (const tag of visibleTagList) {
            tag.classList.remove('hidden')
        }
    }
}

/**
 * LINEAR SEARCH FUNCTION
 */

// function filterRecipes(event) {
//     let searchValue

//     if(tagnameFilter.includes(event.target) || event.target.classList.contains('tag-on')) {
//         searchValue = searchRecipe.value

//         if(event.target.classList.contains('selected')) {
//             selectedTag = [...selectedTag, event.currentTarget.textContent.toLowerCase()]
//             const newTag = displaySelectedTag(event)
//             newTag.addEventListener('click', filterRecipes)
//         } else {
//             const indexTagToRemove = selectedTag.indexOf(event.currentTarget.textContent.toLowerCase())
//             const tagParentId = event.currentTarget.closest('ul').id || event.currentTarget.getAttribute('data-filter-category')
//             removeSelectedTag(event.currentTarget.textContent, tagParentId)
//             selectedTag.splice(indexTagToRemove, 1)
//         }
//     } else {
//         searchValue = event.currentTarget.value.toLowerCase()
//     }

//     const searchKeywords = searchValue.split(' ')
//     let visibleRecipeIngredients = []
//     let visibleRecipeAppareils = []
//     let visibleRecipeUstensils = []

//     if (searchValue.trim().length >= 3 || selectedTag.length >= 1) {
//         recipes.forEach((recipe, index) => {
//             const nameKeywords = [recipe.name.toLowerCase()]
//             const ingredientsKeywords = recipe.ingredients.map(item => item.ingredient.toLowerCase()).flat()
//             const descriptionKeywords = recipe.description.toLowerCase()
//             const applianceKeywords = recipe.appliance.toLowerCase()
//             const ustensilsKeywords = recipe.ustensils.map(item => item.toLowerCase())
//             const recipeCardKeywords = [... new Set([... nameKeywords, ingredientsKeywords, descriptionKeywords, applianceKeywords, ustensilsKeywords].flat())]
//             const recipeFiltersKeywords = [... new Set([... ingredientsKeywords, applianceKeywords, ustensilsKeywords].flat())]

//             const searchIsMatching = searchKeywords.every(word => recipeCardKeywords.some(keyword => keyword.includes(word)))
//             const filterIsMatching = selectedTag.every(word => recipeFiltersKeywords.includes(word))
//             const displayCard = searchIsMatching && filterIsMatching
//             displayCard ? recipesCards[index].classList.remove('hidden') : recipesCards[index].classList.add('hidden')
            
//             if (displayCard) {
//                 recipesCards[index].classList.remove('hidden')
//                 visibleRecipeIngredients = [...visibleRecipeIngredients, ingredientsKeywords]
//                 visibleRecipeAppareils = [...visibleRecipeAppareils, applianceKeywords]
//                 visibleRecipeUstensils = [...visibleRecipeUstensils, ustensilsKeywords]
//             } else {
//                 recipesCards[index].classList.add('hidden')
//             }            
//         })
//     } else {
//         recipesCards.forEach(recipe => recipe.classList.remove('hidden'))
//     }

//     // Update all filter list
//     // const visibleRecipes = document.querySelectorAll('.recipe-card:not(.hidden)')
//     // console.log('visibleRecipes: ', visibleRecipes)

//     const hiddenRecipes = document.querySelectorAll('.recipe-card.hidden')
//     visibleRecipeIngredients = [... new Set(visibleRecipeIngredients.flat())]
//     visibleRecipeUstensils = [... new Set(visibleRecipeUstensils.flat())]

//     tagsIngredientsList.forEach((tagIngredient, index) => {
//         const isMatch = visibleRecipeIngredients.includes(tagIngredient.children[0].textContent.toLowerCase())
//         isMatch || tagIngredient.children[0].classList.contains('selected') || visibleRecipeIngredients.length === 0 ? tagsIngredientsList[index].classList.remove('hidden')
//         : tagsIngredientsList[index].classList.add('hidden')
//     })

//     tagsAppareilsList.forEach((tagAppareil, index) => {
//         const isMatch = visibleRecipeAppareils.includes(tagAppareil.children[0].textContent.toLowerCase())
//         isMatch || tagAppareil.children[0].classList.contains('selected') || visibleRecipeAppareils.length === 0 ? tagsAppareilsList[index].classList.remove('hidden')
//         : tagsAppareilsList[index].classList.add('hidden')
//     })

//     tagsUstensilsList.forEach((tagUstensil, index) => {
//         const isMatch = visibleRecipeUstensils.includes(tagUstensil.children[0].textContent.toLowerCase())
//         isMatch || tagUstensil.children[0].classList.contains('selected') || visibleRecipeUstensils.length === 0 ? tagsUstensilsList[index].classList.remove('hidden')
//         : tagsUstensilsList[index].classList.add('hidden')
//     })

//     // Update recipe counter
//     recipeCounter = recipes.length - hiddenRecipes.length
//     recipeCounterNode.textContent = `${recipeCounter} ${recipeCounter > 1 ? 'recettes':'recette'}`
// }