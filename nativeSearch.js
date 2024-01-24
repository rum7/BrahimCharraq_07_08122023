let searchValue

let searchKeywords = searchValue.length >= 3 ? searchValue.split(' ') : []

if (searchValue.trim().length >= 3) {
    const nameKeywords = [... new Set(recipes[index].name.toLowerCase().split(' '))]

    let descriptionKeywords = recipes[index].description.toLowerCase().replace(/[^\p{L}\s]/gu, '').replace(/\s{2,}/g, ' ').trim()
    descriptionKeywords = [... new Set(descriptionKeywords.split(' '))].sort((a, b) => a.localeCompare(b))

    let ingredientsKeywords = []
    for (const item of recipes[index].ingredients) { ingredientsKeywords = [... ingredientsKeywords, item.ingredient.toLowerCase().replace(/[^\p{L}\s]/gu, '').replace(/\s{2,}/g, ' ').trim().split(' ')].flat() }

    const recipeCardKeywords = [... new Set([... nameKeywords, ingredientsKeywords, descriptionKeywords].flat())]
    recipeCardKeywords.sort((a, b) => a.localeCompare(b))

    let searchIsMatching
    if (searchKeywords.length >= 1) {
        searchIsMatching = searchKeywords.every(word => {
            let start = 0
            let end = recipeCardKeywords.length - 1
            let found = false
        
            while (start <= end) {
                let mid = Math.floor((start + end) / 2)
                let middleKeyword = recipeCardKeywords[mid]
                let comparingWords = middleKeyword.localeCompare(word)
        
                if (middleKeyword.indexOf(word) !== -1) {
                    found = true
                    break
                } else if (comparingWords < 0) {
                    start = mid + 1
                } else if (comparingWords > 0) {
                    end = mid - 1
                }
            }
        
            return found
        })
    } 

    if (searchIsMatching === true) {
        console.log('TROUVÉ')            
    } else {
        console.log('RIEN TROUVÉ')            
    } 

} else {
    console.log('RIEN TROUVÉ DU TOUT')            
}