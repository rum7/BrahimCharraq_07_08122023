export async function getRecipes() {
    const response = await fetch('./src/data/recipes.json')
    const data = await response.json()
    const recipes = data.recipes
    
    const recipeIngredients = data.recipes.map(recipes => {
        const ingredients = recipes.ingredients.map(name => name.ingredient.toLowerCase())
        const recipeIngredients = {}
        recipeIngredients[recipes.id] = ingredients
        return recipeIngredients
    })

    const recipeAppareils = data.recipes.map(recipes => {
        const appareils = recipes.appliance.toLowerCase()
        const recipeAppareils = {}
        recipeAppareils[recipes.id] = [appareils]
        return recipeAppareils
    })

    const recipeUstensils = data.recipes.map(recipes => {
        const ustensils = recipes.ustensils.map(name => name.toLowerCase())
        const recipeUstensils = {}
        recipeUstensils[recipes.id] = ustensils
        return recipeUstensils
    })

    const ingredients = await getFilterById(recipeIngredients)
    const appareils = await getFilterById(recipeAppareils)
    const ustensils = await getFilterById(recipeUstensils)

    return { recipes, ingredients, appareils, ustensils }
}

async function getFilterById(filters) {
    const filtersById = filters.reduce((acc, filter) => {
        for (let id in filter) {
            filter[id].forEach(filter => {
                acc[filter] = acc[filter] ? [...acc[filter], id] : [id];
            })
        }
        return acc
    }, {})

    let arrayFiltersById = []
    for (const [key, value] of Object.entries(filtersById)) {
        const object = {}
        object[key] = value
        arrayFiltersById = [...arrayFiltersById, object]
    }
    return arrayFiltersById
}