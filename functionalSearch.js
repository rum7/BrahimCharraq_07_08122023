let searchValue

let searchKeywords = searchValue.length >= 3 ? searchValue.split(' ') : []

if (searchValue.trim().length >= 3) {
    recipes.forEach(recipe => {
        const nameKeywords = [... new Set(recipe.name.toLowerCase().split(' '))]

        let descriptionKeywords = recipe.description.toLowerCase().replace(/[^\p{L}\s]/gu, '').replace(/\s{2,}/g, ' ').trim()
        descriptionKeywords = [... new Set(descriptionKeywords.split(' '))]

        const ingredientsKeywords = recipe.ingredients.map(item => item.ingredient.toLowerCase()).flat()

        const recipeCardKeywords = [... new Set([... nameKeywords, ingredientsKeywords, descriptionKeywords].flat())]

        let searchIsMatching

        if (searchKeywords.length >= 1) {
            searchIsMatching = searchKeywords.every(word => recipeCardKeywords.some(keyword => keyword.includes(word)))
        }
        
        if (searchIsMatching === true) {
            console.log('TROUVÉ')            
        } else {
            console.log('RIEN TROUVÉ')            
        }            
    })
} else {
    console.log('RIEN TROUVÉ DU TOUT')            
}