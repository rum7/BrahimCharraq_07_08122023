export function filterRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes-container')
    const recipesCards = recipesContainer.querySelectorAll('div')

    const recipesCardsContainer = Array.from(recipesCards).filter(div => !div.closest('div'))
    console.log('recipesCardsContainer: ', recipesCardsContainer)

}